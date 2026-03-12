---
slug: from-react-to-gpu-how-xframes-renders
title: "From React to GPU: How XFrames Renders"
authors: [andreamancuso]
tags: [architecture]
toc_min_heading_level: 2
toc_max_heading_level: 5
---

You write `<XFrames.Button label="Click me" />` and a GPU-rendered button appears on screen. No DOM, no CSS, no browser engine. What happens in between?

XFrames bridges two very different worlds: React's declarative component model and Dear ImGui's immediate-mode rendering. This post traces the full path from JSX to pixels.

<!-- truncate -->

## The pipeline at a glance

Before diving into detail, here's the complete rendering pipeline in eight steps:

1. React's reconciler diffs your component tree
2. A vendored React Native Fabric renderer intercepts create, update, and child operations
3. A custom `nativeFabricUiManager` serializes each operation as JSON and sends it to C++
4. An RPP reactive subject queues operations for thread-safe consumption on the render thread
5. The C++ element registry creates or updates widget objects
6. Yoga computes flexbox layout for the entire element tree
7. Each widget calls ImGui APIs to build a draw list
8. The ImGui backend submits draw commands to OpenGL (desktop) or WebGPU (browser)

Every frame, steps 6-8 repeat. Steps 1-5 only run when your React state changes.

## The Fabric renderer

XFrames doesn't use React DOM. Instead, it uses a vendored copy of React Native's Fabric renderer — the architecture React Native uses to talk to platform-native UI. Fabric calls a `nativeFabricUiManager` interface to create nodes, append children, and update props. XFrames provides its own implementation of this interface.

When React reconciles your component tree, Fabric calls into the custom manager:

- **`createNode()`** parses the element's props and calls `wasmModule.setElement(JSON.stringify(element))` — sending the full element definition to C++ as a JSON string.
- **`appendChild()`** calls `wasmModule.appendChild(parentId, childId)` — establishing the parent-child relationship.
- **`cloneNodeWithNewProps()`** calls `wasmModule.patchElement(id, JSON.stringify(patch))` — sending only the changed props.

All data crosses the JavaScript/C++ boundary as JSON strings. This is the single abstraction that lets the same React components work on both desktop (via Node-API) and browser (via Emscripten embind) without any platform-specific code in the component layer.

## The reactive queue

On desktop, JavaScript runs on the main thread while ImGui renders on a separate thread. Operations can't modify the element registry directly — that would race with the render loop.

The solution is a reactive queue: an RPP `serialized_replay_subject<ElementOpDef>` that accepts operations from any thread and delivers them sequentially on the render thread. Each operation is one of four types:

- **`CreateElement`** — instantiate a widget, register it in the element map
- **`PatchElement`** — update an existing widget's props and styles
- **`SetChildren`** — replace a parent's child list atomically
- **`AppendChild`** — add a single child to a parent

The subscription handler switches on the operation type and updates two data structures: the **element registry** (`unordered_map<int, unique_ptr<Element>>`) which owns all widget instances, and the **hierarchy map** (`unordered_map<int, vector<int>>`) which tracks parent-child relationships.

Widgets that support imperative operations — tables, plots, maps — get their own per-widget reactive subject. When JavaScript calls `elementInternalOp(id, json)`, the operation is routed to that widget's subject and handled by its `HandleInternalOp()` method.

## Yoga layout

Every element owns a `LayoutNode` that wraps a Yoga `YGNodeRef`. When `CreateElement` processes a new element, the JSON style properties — `flexDirection`, `padding`, `width`, `gap`, and so on — are translated into Yoga API calls on the node.

Layout calculation happens once per frame, triggered at the root element:

```cpp
YGNodeCalculateLayout(rootNode, windowWidth, windowHeight, YGDirectionLTR);
```

This single call recursively computes positions and sizes for the entire tree based on flexbox rules. Child elements don't recalculate — they just read their pre-computed values:

```cpp
float left   = YGNodeLayoutGetLeft(node);
float top    = YGNodeLayoutGetTop(node);
float width  = YGNodeLayoutGetWidth(node);
float height = YGNodeLayoutGetHeight(node);
```

This is the same Yoga engine used by React Native, so flexbox properties like `flex`, `alignItems`, `justifyContent`, and percentage-based sizing behave identically.

## ImGui rendering

The render loop calls `XFrames::Render()` every frame. This method traverses the hierarchy recursively, visiting each element in tree order. Each element's `Render()` method follows a consistent pattern:

1. **Position and clip.** Read the Yoga-computed position and size, call `ImGui::SetCursorPos()` and `ImGui::BeginChild()` to create a clipped rectangular region.
2. **Draw base effects.** Apply background color, border, and rounding via `ImDrawList` calls.
3. **Widget-specific rendering.** Call the ImGui API for this widget type — `ImGui::Button()` for buttons, `ImGui::InputText()` for text inputs, `ImPlot::PlotLine()` for line charts, `ImDrawList::AddImage()` for map tiles.
4. **Interaction state.** Check if the element is hovered or active, and re-apply the matching style variant (`hoverStyle`, `activeStyle`) if the state changed.
5. **Close.** Call `ImGui::EndChild()`.

ImGui is immediate-mode: nothing is retained between frames. The draw list is rebuilt from scratch every frame. React's retained component tree and Yoga's cached layout mean XFrames avoids redundant layout recalculations, but ImGui widgets always re-render — this is what keeps the rendering fast and predictable.

The class hierarchy — `Element` -> `Widget` -> `StyledWidget` -> `(Button, Table, PlotLine, MapView, ...)` — keeps per-widget rendering code isolated while sharing style extraction, layout, and interaction state logic in the base classes.

## GPU submission

After the element tree traversal, `ImGui::Render()` packages the accumulated draw list into a flat array of vertices, indices, and texture IDs. The ImGui backend then submits this to the GPU:

- **Desktop:** `ImGui_ImplOpenGL3_RenderDrawData()` issues OpenGL draw calls (`glDrawElements`).
- **Browser:** `ImGui_ImplWGPU_RenderDrawData()` issues WebGPU draw calls (`wgpuRenderPassEncoderDrawIndexed`).

ImGui batches draw commands by texture to minimize GPU state changes. For a typical dashboard with buttons, text, tables, and charts, the entire frame might compile down to a handful of draw calls. The result: your React component tree is on screen at 60fps, rendered directly by the GPU without a DOM in sight.

## Events: the reverse path

The pipeline also runs in reverse. When a user clicks a button or types into an input field, ImGui detects the interaction during its `Render()` pass. The C++ widget invokes a callback — a NAPI `ThreadSafeFunction` on desktop, or an `EM_ASM` macro on WASM — which crosses back into JavaScript.

The JavaScript handler dispatches a React synthetic event through the Fabric renderer's event system:

```typescript
nativeFabricUIManager.dispatchEvent(id, "onChange", { value });
```

This triggers your React event handler just like a DOM event would in a web app. The full round trip — GPU input detection, C++ callback, JS dispatch, React handler — happens within a single frame.

## Wrapping up

This pipeline is what lets XFrames offer familiar React patterns — components, hooks, JSX, state management — while bypassing the DOM entirely. The Fabric renderer provides the React integration, JSON provides the cross-language contract, Yoga provides the layout, and ImGui provides the GPU-accelerated rendering.

To start building with XFrames, see the [Getting Started guide](/docs/intro). For the full list of available components, check the [widget catalog](/docs/category/components).

---
title: Frequently Asked Questions
---

Answers to common questions about XFrames, its capabilities, and how to get started.

## What is XFrames?

XFrames is an open-source framework for building GPU-accelerated desktop and browser applications using React and TypeScript. You write standard React components, and XFrames renders them as native [Dear ImGui](https://github.com/ocornut/imgui) widgets via OpenGL (desktop) or WebGPU (browser) — no DOM, no CSS, no Electron.

Get started in seconds with `npx create-xframes-node-app`. Experimental bindings also exist for [25+ other programming languages](/docs/other-languages). See the [Getting Started guide](/docs/intro) for a full walkthrough.

---

## What is Dear ImGui?

[Dear ImGui](https://github.com/ocornut/imgui) is a widely-used C++ immediate-mode GUI library with 60k+ GitHub stars, commonly found in game engines, profiling tools, and internal development tools. "Immediate mode" means the UI is redrawn every frame from code rather than maintaining a persistent widget tree in the DOM.

XFrames abstracts this away — you write declarative React components with hooks and JSX, and the framework translates them into ImGui draw calls. [ImPlot](https://github.com/epezent/implot), a charting library built on Dear ImGui, is also included for data visualization. See the [Technologies](/technologies-used) page for the full tech stack.

---

## What problem does XFrames solve?

Desktop frameworks like Electron bundle a full Chromium browser, resulting in large binaries (100MB+), high memory usage, and slow startup times. XFrames renders directly through the GPU via Dear ImGui, bypassing the browser engine entirely.

The result: binaries in the 10-50MB range (depending on language), lower memory footprint, faster startup, and 60fps rendering. Developers keep the React component model and familiar patterns — hooks, state, JSX — without the overhead of a bundled browser.

---

## How do I get started?

Prerequisites: Node.js 18+.

```bash
npx create-xframes-node-app my-app
cd my-app
npm start
```

A native desktop window will open with a working demo application. For running XFrames in the browser instead, see the [WASM / Browser Guide](/docs/wasm-guide). The [Getting Started guide](/docs/intro) has a full walkthrough of the scaffolded app.

---

## Does XFrames work in the browser?

Yes. The C++ core compiles to WebAssembly via Emscripten and renders into an HTML `<canvas>` element using the WebGPU graphics API. The same React components and styling from `@xframes/common` work on both desktop and browser — your code is portable between targets.

Browser requirements: Chrome, Edge, or Firefox Nightly (WebGPU is required; there is no WebGL or Canvas 2D fallback). See the [WASM / Browser Guide](/docs/wasm-guide) for build instructions and a complete example.

---

## What widgets are available?

XFrames provides a comprehensive widget set:

- **Layout:** Node (flexbox container), Window, CollapsingHeader, Group, ItemTooltip, TextWrap
- **Navigation:** TabBar (reorderable), TabItem (closeable), TreeNode, TreeView
- **Text:** UnformattedText, BulletText, DisabledText, SeparatorText, Separator, ClippedMultiLineTextRenderer
- **Form controls:** Button, Checkbox, Combo, InputText (multiline, password, read-only, numeric-only), Slider, MultiSlider, ColorPicker
- **Data display:** Table (sorting, filtering, column reorder/visibility, context menus, row selection), ProgressBar, ColorIndicator, Image
- **Charts:** PlotLine (multi-series, streaming), PlotBar, PlotScatter, PlotCandlestick, PlotHeatmap, PlotHistogram, PlotPieChart
- **Maps:** MapView (OpenStreetMap tiles, markers, polylines, overlays)

All components support interaction-state styling (default, hover, active, disabled). See the [widget catalog](/docs/category/components) for props, events, imperative handles, and code examples.

---

## How does layout work?

XFrames uses [Yoga](https://www.yogalayout.dev/), the same flexbox layout engine used by React Native. `<XFrames.Node>` is the layout container, equivalent to `<div>` or `<View>`.

Standard flexbox properties are supported: `flexDirection`, `flex`, `padding`, `margin`, `gap`, `alignItems`, `justifyContent`, `width`, `height`, and percentage values. Scroll containers are created with `overflow: "scroll"`.

Note that `padding` and `margin` use object syntax — `{ all: 8 }` or `{ left: 8, right: 8 }` — not plain numbers. See the [Layout guide](/docs/layout-guide) and [Yoga layout properties](/docs/typescript/style/yoga-layout-properties) for details.

---

## How does styling and theming work?

Styles are defined with `RWStyleSheet.create()` and applied via the `style` prop, similar to React Native's `StyleSheet`. There are three styling layers: Yoga layout properties, base drawing properties (background color, border, rounding), and ImGui-specific properties (font, colors, style vars).

Each widget supports four interaction states: `style`, `hoverStyle`, `activeStyle`, and `disabledStyle`. Three built-in themes are included (Dark, Light, Ocean), and themes can be switched at runtime via `patchStyle`.

See the [Styling guide](/docs/typescript/style/general-styling-concepts) and [Theming guide](/docs/typescript/style/theming-guide) for full details.

---

## Can I use existing React and npm libraries?

React logic libraries work normally — XFrames uses real React with a custom renderer, so state management, hooks, data fetching, and utility libraries all function as expected.

However, React UI libraries that render to the DOM (Material UI, Chakra UI, Ant Design, etc.) will not work. XFrames does not use the DOM or CSS, so any library that generates HTML elements or relies on CSS stylesheets is incompatible. XFrames provides its own [widget set](/docs/category/components) and [styling system](/docs/typescript/style/general-styling-concepts) as replacements.

---

## How does XFrames compare to Electron?

XFrames has no browser engine, no DOM, and no CSS. This means smaller binaries, lower memory usage, faster startup, and GPU-accelerated rendering at 60fps. It's a strong fit for performance-critical dashboards, real-time data visualization, internal tools, and developer utilities.

Electron is a better fit when your application needs full web content rendering (rich text editors, embedded web views), relies heavily on the npm UI component ecosystem, or requires pixel-perfect CSS-based styling.

A hybrid approach is also possible — XFrames can handle GPU-intensive panels within an Electron application while Electron manages web-based UI. XFrames is not a drop-in Electron replacement; it's a different rendering paradigm that trades DOM flexibility for GPU performance.

---

## Is XFrames cross-platform?

Yes. The desktop target (Node.js native addon, OpenGL 3) supports Windows, macOS, and Linux. The browser target (WebAssembly, WebGPU) runs in Chrome, Edge, and Firefox Nightly.

The same React components and styles work across all targets. Note that WSL2 on Windows requires setting `export GALLIUM_DRIVER=d3d12` for OpenGL compatibility.

---

## Can I distribute XFrames apps as standalone executables?

Yes. For Node.js, tools like [Nexe](https://github.com/nexe/nexe) can bundle Node.js, the native addon, and assets into a single executable. For compiled language bindings, you need only the executable and shared library files (.dll, .so, .dylib).

Approximate distribution sizes by stack:

| Stack | Size |
|-------|------|
| Node.js (via Nexe) | ~50 MB |
| .NET languages (C#, F#) | 25-30 MB |
| Kotlin (via Gradle distZip) | ~40 MB |
| Python (via PyInstaller) | 20-25 MB |
| Compiled languages (Nim, Rust, Ada, etc.) | 10-15 MB |
| Electron (for comparison) | 100+ MB |

The WASM target produces a standard web bundle suitable for any static hosting provider.

---

## Is XFrames production-ready?

XFrames is actively developed. The API is stabilizing but may still have breaking changes between releases. Dear ImGui itself is mature and battle-tested, used in game engines, profiling tools, and many production applications worldwide.

Recommended for: internal tools, dashboards, data visualization, developer utilities, and prototyping. Not yet recommended for consumer-facing applications where pixel-perfect brand styling is critical. Check the [GitHub repository](https://github.com/xframes-project/xframes) for the latest release status.

---

## What font formats are supported?

XFrames supports TTF (TrueType) fonts only. Fonts are pre-rendered into a GPU texture atlas at startup — you declare which fonts and sizes to load in your `fontDefs` configuration.

[Font Awesome 6 Solid](https://fontawesome.com/) icons are automatically merged into every loaded font, so icon glyphs are available without additional setup. See the [Fonts guide](/docs/fonts-guide) for configuration details and usage examples.

---

## Are there bindings for other programming languages?

TypeScript with React and Node.js is the primary supported stack, with full documentation, npm packages, and active development.

Experimental bindings exist for 25+ additional languages — including Python, Rust, Java, Kotlin, C#, F#, Go, and many more — via C API, FFI, and JNI. These bindings are functional but have limited documentation and are not the primary development focus. See the [Language Bindings](/docs/other-languages) page for the complete list and repository links.

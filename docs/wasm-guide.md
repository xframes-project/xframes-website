---
sidebar_position: 4
title: WASM / Browser Guide
---

# WASM / Browser Guide

XFrames can run in the browser using WebAssembly and WebGPU. You write the same React components from `@xframes/common` — the C++ core is compiled to WASM via Emscripten, and renders into an HTML `<canvas>` element using the WebGPU graphics API.

This guide covers building the WASM module, running the dev server, and understanding the differences from the Node.js desktop target.

## Prerequisites

- **Docker** (for the recommended build path) or a local [emsdk](https://emscripten.org/docs/getting_started/downloads.html) 5.0.2+ installation
- **Node.js** and npm
- **A browser with WebGPU support**: Chrome, Edge, or Firefox Nightly

:::warning
WebGPU is required. There is no Canvas 2D or WebGL fallback. Check [webgpu.io](https://webgpu.io) for current browser support.
:::

## How it works

The architecture is the same as the desktop target: a vendored React Native Fabric renderer intercepts React component operations (`createNode`, `appendChild`, etc.) and forwards them to the C++ ImGui engine. The difference is the transport layer — instead of Node-API (NAPI) with `ThreadSafeFunction`, the WASM target uses Emscripten `embind` for JS-to-C++ calls and `EM_ASM` macros for C++-to-JS callbacks.

All React components, styles, themes, and layout from `@xframes/common` work identically on both platforms.

## Node vs WASM comparison

| Aspect | Node (Desktop) | WASM (Browser) |
|--------|---------------|----------------|
| Graphics backend | OpenGL 3 | WebGPU |
| Build tool | cmake-js | Docker + Emscripten |
| Entry point | `render(App, ...)` | `<XFrames>` React component |
| Threading | Multi-threaded (NAPI TSFN) | Single-threaded |
| File I/O | Full filesystem | Browser sandboxed |
| MapView tile cache | GPU + memory + disk | GPU LRU + browser HTTP cache |

## Building the WASM module

### Using Docker (recommended)

From the repository root:

```bash
./packages/dear-imgui/cpp/wasm/build-wasm-docker.sh
```

This builds using the `emscripten/emsdk:5.0.2` Docker image with Ninja and ccache. The output is a single file at `packages/dear-imgui/npm/wasm/src/lib/xframes.mjs` containing the JavaScript glue code with the WASM binary embedded.

A named Docker volume (`xframes-ccache`) persists the compilation cache across builds, making incremental rebuilds faster.

:::note
For faster development builds, pass the `--fast` flag. This compiles with `-O0` instead of `-O3`, significantly reducing build time at the cost of runtime performance.

```bash
./packages/dear-imgui/cpp/wasm/build-wasm-docker.sh --fast
```
:::

### Manual build (local emsdk)

If you prefer not to use Docker, you can build with a local Emscripten installation:

```bash
cd packages/dear-imgui/cpp/wasm
cmake -S . -B build -GNinja
cmake --build ./build --target xframes
```

:::warning
You must have `emsdk` sourced in your shell before running CMake. The build will fail if the `EMSDK` environment variable is not set.
:::

## Running the dev server

```bash
cd packages/dear-imgui/npm/wasm
npm install
npm start
```

This starts a Webpack dev server on port 3000 and auto-opens your browser. The dev server automatically sets the required `Cross-Origin-Embedder-Policy` and `Cross-Origin-Opener-Policy` headers for `SharedArrayBuffer` access.

:::note
If you modify `@xframes/common` source files, `npm start` automatically rebuilds common before starting (via the `prestart` script). No manual linking needed.
:::

## Understanding the WASM entry point

Unlike the Node target which calls `render(App, assetsBasePath, fontDefs, theme)`, the WASM target wraps your app in an `<XFrames>` React component that manages the canvas, WASM module lifecycle, and resize handling.

Here is a minimal example:

```tsx
import { useMemo, useRef } from "react";
// @ts-ignore
import getWasmModule from "./lib/xframes.mjs";
// @ts-ignore
import wasmDataPackage from "./lib/xframes.data";

import { XFramesStyleForPatching } from "@xframes/common";
import { XFrames } from "./lib";
import { GetWasmModule } from "./lib/wasm-app-types";
import { theme2 } from "./themes";

import "./App.css";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const fontDefs = useMemo(
    () => [{ name: "roboto-regular", sizes: [16, 18, 20, 24] }],
    []
  );

  const defaultFont = useMemo(
    () => ({ name: "roboto-regular", size: 16 }),
    []
  );

  const styleOverrides: XFramesStyleForPatching = useMemo(() => theme2, []);

  return (
    <div id="app" ref={containerRef}>
      <XFrames
        getWasmModule={getWasmModule as GetWasmModule}
        wasmDataPackage={wasmDataPackage as string}
        containerRef={containerRef}
        fontDefs={fontDefs}
        defaultFont={defaultFont}
        styleOverrides={styleOverrides}
      >
        <XFrames.Node root style={{ height: "100%" }}>
          <XFrames.UnformattedText text="Hello from WASM!" />
        </XFrames.Node>
      </XFrames>
    </div>
  );
}

export default App;
```

### `<XFrames>` component props

| Prop | Type | Description |
|------|------|-------------|
| `getWasmModule` | `GetWasmModule` | The WASM module factory function (imported from `xframes.mjs`) |
| `wasmDataPackage` | `string` | The preloaded data package containing fonts and assets |
| `containerRef` | `RefObject<HTMLElement>` | Ref to the container div — used for `ResizeObserver` to handle dynamic sizing |
| `fontDefs` | `FontDef[]` | Font definitions with available sizes |
| `defaultFont` | `{ name, size }` | Default font used by widgets that don't specify one |
| `styleOverrides` | `XFramesStyleForPatching` | Theme object (same type as the Node `theme` parameter) |

### Font definitions: Node vs WASM

The font definition format differs slightly between targets:

```tsx
// Node — expanded array of { name, size } pairs, wrapped in { defs: [...] }
const fontDefs = {
  defs: [{ name: "roboto-regular", sizes: [16, 18, 20, 24] }]
    .map(({ name, sizes }) => sizes.map((size) => ({ name, size })))
    .flat(),
};

// WASM — array of { name, sizes } objects directly
const fontDefs = [
  { name: "roboto-regular", sizes: [16, 18, 20, 24] },
];
```

:::warning
In WASM, pass an array of `{ name, sizes }` objects. The `<XFrames>` component handles the expansion internally. Do not wrap it in `{ defs: [...] }`.
:::

### Required CSS

The container div and body need minimal CSS for the canvas to fill the viewport:

```css
/* index.css */
body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
}

/* App.css */
#app {
  width: 100%;
  height: 100vh;
}
```

## Shared code with Node

All React components, the stylesheet system, and theming work identically on both targets. Code written for Node runs in the browser without changes:

```tsx
import { RWStyleSheet, faIconMap } from "@xframes/common";

const styles = RWStyleSheet.create({
  container: {
    style: {
      flexDirection: "row",
      padding: { all: 8 },
      gap: { column: 8 },
    },
  },
});
```

Widgets like `Button`, `Table`, `PlotLine`, `MapView`, and all others are available from `XFrames.*` in both environments.

## WASM-specific limitations

- **WebGPU required** — no WebGL or Canvas 2D fallback
- **Single-threaded** — the browser's connection pool limits parallel network requests to approximately 6 concurrent fetches
- **No disk tile cache** — MapView relies on the GPU LRU cache and browser HTTP cache only (no filesystem-based tile storage)
- **16-bit glyph range** — `IMGUI_USE_WCHAR32` is not enabled, so Material Design Icons are unavailable. Font Awesome icons work normally.
- **Browser sandboxed** — no direct filesystem access for features like `cachePath` on MapView
- **COEP/COOP headers required** — your server must set these headers (the Webpack dev server handles this automatically)

## Deploying to production

The WASM build produces a single `.mjs` file with the WASM binary embedded (`-s SINGLE_FILE=1`). After running `npm run build:library` in `npm/wasm/`, the `dist/` directory contains a standard bundle suitable for any static hosting provider.

:::warning
Your production web server must return these headers on every response:
```
Cross-Origin-Embedder-Policy: require-corp
Cross-Origin-Opener-Policy: same-origin
```
Without them, `SharedArrayBuffer` will be unavailable and the WASM module will fail to initialize.
:::

## Next steps

- [Layout guide](/docs/layout-guide) — Yoga flexbox basics, scroll containers, and nested layouts
- [Fonts guide](/docs/fonts-guide) — font definitions, available sizes, and Font Awesome icons
- [Widget catalog](/docs/category/components) — all available components with props and code examples
- [Styling guide](/docs/typescript/style/general-styling-concepts) — colors, backgrounds, and interaction states
- [Theming guide](/docs/typescript/style/theming-guide) — built-in themes and runtime theme switching

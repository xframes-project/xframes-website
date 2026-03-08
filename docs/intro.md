---
sidebar_position: 1
---

# What is XFrames?

XFrames is a framework for building GPU-accelerated desktop applications using React and TypeScript — without DOM, CSS, or Electron. You write standard React components, and XFrames renders them as native Dear ImGui widgets via OpenGL (desktop) or WebGPU (browser).

The result is lightweight, fast desktop apps with real-time data visualization, built with the same React patterns you already know.

## Quick Start

```bash
npx create-xframes-node-app
```

Enter a project name, then:

```bash
cd my-app
npm start
```

A native desktop window will appear with "Hello, world" rendered via Dear ImGui.

## Understanding the Scaffolded App

The generated `src/index.tsx` is the entry point:

```tsx
import { resolve } from "path";
import * as React from "react";
import { theme2 } from "./themes";
import { render, XFrames } from "@xframes/node";

const fontDefs = {
  defs: [{ name: "roboto-regular", sizes: [16, 18, 20, 24] }]
    .map(({ name, sizes }) => sizes.map((size) => ({ name, size })))
    .flat(),
};

const assetsBasePath = resolve("./assets");

const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.UnformattedText text="Hello, world" />
  </XFrames.Node>
);

render(App, assetsBasePath, fontDefs, theme2);
```

### The `render()` function

`render()` takes four arguments:

| Argument | Description |
|----------|-------------|
| `App` | Your root React component |
| `assetsBasePath` | Path to the `assets/` directory containing font files |
| `fontDefs` | Font definitions — which `.ttf` fonts and sizes to load |
| `theme` | A theme object that sets all ImGui colors |

### Font definitions

The `fontDefs` object tells XFrames which font sizes to pre-render into the GPU texture atlas. Each entry must match a `.ttf` file in `assets/fonts/`:

```tsx
const fontDefs = {
  defs: [
    { name: "roboto-regular", sizes: [16, 18, 20, 24, 32] },
  ]
    .map(({ name, sizes }) => sizes.map((size) => ({ name, size })))
    .flat(),
};
```

The `name` field maps to `assets/fonts/roboto-regular.ttf`. Only the sizes you list here are available at runtime.

### The root Node

Every XFrames app needs a root `<XFrames.Node>` with the `root` prop. Set `height: "100%"` so it fills the window:

```tsx
<XFrames.Node root style={{ height: "100%" }}>
  {/* your app goes here */}
</XFrames.Node>
```

## Your First Layout

XFrames uses [Yoga](https://www.yogalayout.dev/) for flexbox layout — the same layout engine as React Native. Here's a two-column layout:

```tsx
import { RWStyleSheet } from "@xframes/common";

const styles = RWStyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    height: 200,
  },
  column: {
    flex: 1,
    padding: { all: 8 },
  },
});

const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.Node style={styles.row}>
      <XFrames.Node style={styles.column}>
        <XFrames.UnformattedText text="Left column" />
      </XFrames.Node>
      <XFrames.Node style={styles.column}>
        <XFrames.UnformattedText text="Right column" />
      </XFrames.Node>
    </XFrames.Node>
  </XFrames.Node>
);
```

:::note
`padding` and `margin` are objects with edge keys — `{ all: 8 }`, `{ left: 8, right: 8 }`, `{ top: 4, bottom: 4 }` — not plain numbers.
:::

## Adding Interactivity

XFrames components use the same React patterns you're used to:

```tsx
import { useState, useCallback } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.UnformattedText text={`Clicked ${count} times`} />
      <XFrames.Button label="Click me" onClick={handleClick} />
    </XFrames.Node>
  );
};
```

## Applying Styles

Use `RWStyleSheet.create()` to define reusable style objects. Font size is set via the `font` property:

```tsx
const styles = RWStyleSheet.create({
  title: {
    padding: { all: 8 },
    font: { name: "roboto-regular", size: 24 },
  },
  container: {
    flexDirection: "row",
    gap: { column: 8 },
    padding: { all: 8 },
  },
});
```

:::note
The font `name` must match one of the fonts in your `fontDefs`, and the `size` must be one of the sizes you listed there.
:::

Every widget supports four style variants for different interaction states:

- `style` — default appearance
- `hoverStyle` — applied when the mouse hovers over the widget
- `activeStyle` — applied when the widget is being clicked/pressed
- `disabledStyle` — applied when the widget is disabled

## Built-in Themes

XFrames ships with three themes, each with a distinct accent color:

| Theme | Import | Background | Accent |
|-------|--------|------------|--------|
| Dark | `theme2` | Near-black | Green |
| Light | `theme1` | White | Coral |
| Ocean | `theme3` | Deep navy | Teal |

Pass your chosen theme to `render()`:

```tsx
import { theme1, theme2, theme3 } from "./themes";

// Start with the dark theme
render(App, assetsBasePath, fontDefs, theme2);
```

You can switch themes at runtime using `patchStyle` — see the [Theming guide](/docs/typescript/style/general-styling-concepts) for details.

## Next Steps

- [Layout guide](/docs/layout-guide) — flexbox basics, scroll containers, and nested layouts
- [Fonts guide](/docs/fonts-guide) — font definitions, sizes, and Font Awesome icons
- [Widget catalog](/docs/category/components) — all available components with props and code examples
- [Styling guide](/docs/typescript/style/general-styling-concepts) — colors, backgrounds, and interaction states
- [Yoga layout properties](/docs/typescript/style/yoga-layout-properties) — full flexbox property reference

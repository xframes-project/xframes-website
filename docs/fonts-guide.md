---
sidebar_position: 3
---

# Fonts Guide

XFrames pre-renders fonts into a GPU texture atlas at startup. You declare which fonts and sizes you need in `fontDefs`, then reference them in style rules with `font: { name, size }`.

## Defining fonts

The `fontDefs` object lists every font/size combination to load. Each `name` maps to a `.ttf` file in `assets/fonts/` — for example, `"roboto-regular"` loads `assets/fonts/roboto-regular.ttf`.

```tsx
const fontDefs = {
  defs: [
    { name: "roboto-regular", sizes: [16, 18, 20, 24, 32] },
    { name: "roboto-bold", sizes: [16, 20, 24] },
  ]
    .map(({ name, sizes }) => sizes.map((size) => ({ name, size })))
    .flat(),
};
```

The `.map().flat()` pattern expands `{ name, sizes: [16, 20] }` into `[{ name, size: 16 }, { name, size: 20 }]`, which is the format the native layer expects.

Pass `fontDefs` as the third argument to `render()`:

```tsx
render(App, assetsBasePath, fontDefs, theme);
```

## Available font files

These fonts ship with `create-xframes-node-app` in `assets/fonts/`:

| File | Description |
|------|-------------|
| `roboto-regular.ttf` | Default sans-serif |
| `roboto-bold.ttf` | Bold weight |
| `roboto-light.ttf` | Light weight |
| `roboto-mono-regular.ttf` | Monospace |

To use a custom font, drop its `.ttf` file into `assets/fonts/` and add it to `fontDefs` with the filename (without extension) as the `name`.

## Using fonts in styles

Set the font on any widget via the `font` property in a style rule. Both `name` and `size` must match an entry in your `fontDefs`:

```tsx
import { RWStyleSheet } from "@xframes/common";

const styles = RWStyleSheet.create({
  heading: {
    font: { name: "roboto-bold", size: 32 },
    padding: { bottom: 8 },
  },
  body: {
    font: { name: "roboto-regular", size: 16 },
  },
  code: {
    font: { name: "roboto-mono-regular", size: 14 },
  },
});
```

```tsx
const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.UnformattedText style={styles.heading} text="Dashboard" />
    <XFrames.UnformattedText style={styles.body} text="Welcome to the app." />
  </XFrames.Node>
);
```

:::warning
If you reference a font name or size that isn't in `fontDefs`, the widget will fall back to the default font. Always ensure your style rules match what you declared.
:::

## Font Awesome icons

[Font Awesome 6 Solid](https://fontawesome.com/icons?s=solid) is automatically merged into every loaded font — no extra setup needed. You can render any icon by placing its Unicode character in a text prop.

### Using the icon map

Import `faIconMap` from `@xframes/common` to look up icons by name:

```tsx
import { faIconMap } from "@xframes/common";

const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.UnformattedText text={`${faIconMap["check"]} Connected`} />
    <XFrames.UnformattedText text={`${faIconMap["triangle-exclamation"]} Warning`} />
    <XFrames.UnformattedText text={`${faIconMap["gear"]} Settings`} />
  </XFrames.Node>
);
```

### Using Unicode escapes directly

If you know the codepoint, use a Unicode escape:

```tsx
<XFrames.UnformattedText text={"\uf00c Done"} />   {/* check */}
<XFrames.UnformattedText text={"\uf0e7 Fast"} />   {/* bolt */}
```

Browse available icons at [fontawesome.com/icons](https://fontawesome.com/icons?s=solid). The icon names in `faIconMap` match Font Awesome's naming convention (e.g. `"arrow-right"`, `"circle-info"`, `"house"`).

### Icons in Table columns

Table boolean columns render check and xmark icons automatically — no manual icon handling needed. Set `type: "boolean"` on the column definition and the Table widget handles the rest.

## Tips

- **Only declared sizes are available.** If you need size 28, add it to `fontDefs` — there's no interpolation.
- **More sizes = more GPU memory.** Each font/size combination adds a glyph atlas entry. Declare only what you need.
- **Icons scale with font size.** Font Awesome glyphs are rendered at 2/3 of the text font size for visual alignment.
- **16-bit glyph range only.** Icons in the U+E005–U+F8FF range are supported. Material Design Icons (which require 32-bit glyphs) are not currently available.

## Next steps

- [Layout guide](/docs/layout-guide) — flexbox basics, scroll containers, and nested layouts
- [Styling guide](/docs/typescript/style/general-styling-concepts) — colors, backgrounds, and interaction states

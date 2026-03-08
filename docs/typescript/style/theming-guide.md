---
sidebar_position: 5
---

# Theming Guide

Theming controls ImGui's **global style** — every window background, widget color, spacing value, and rounding radius across your entire application. This is different from [per-widget styling](/docs/typescript/style/general-styling-concepts) where you set `colors` and `vars` on individual components.

XFrames ships with three built-in themes and supports runtime switching via `patchStyle`.

## Built-in themes

| Theme | Style | Accent color | Base |
|-------|-------|-------------|------|
| **Dark** (`theme2`) | Dark backgrounds, light text | Green `#75f986` | Black `#0A0B0D` |
| **Light** (`theme1`) | Light backgrounds, dark text | Coral `#ff6e59` | White `#fff` |
| **Ocean** (`theme3`) | Deep navy backgrounds | Teal `#56d6d6` | Navy `#1a1b2e` |

Each theme defines a color palette and maps it onto ImGui's 53 color slots:

```ts
import { XFramesStyleForPatching, ImGuiCol } from "@xframes/common";

const oceanColors = {
  deepNavy: "#1a1b2e",
  navy: "#252641",
  midNavy: "#2f3055",
  slate: "#4a4b6a",
  lightSlate: "#7a7b9a",
  silver: "#b8bbd0",
  offWhite: "#e8eaf6",
  teal: "#56d6d6",
  hoverTeal: "#7aeaea",
};

const oceanTheme: XFramesStyleForPatching = {
  colors: {
    [ImGuiCol.Text]: [oceanColors.offWhite, 1],
    [ImGuiCol.WindowBg]: [oceanColors.deepNavy, 1],
    [ImGuiCol.Button]: [oceanColors.midNavy, 1],
    [ImGuiCol.ButtonHovered]: [oceanColors.slate, 1],
    [ImGuiCol.ButtonActive]: [oceanColors.teal, 1],
    // ... all 53 ImGuiCol entries
  },
};
```

## Theme object structure

Themes use the `XFramesStyleForPatching` type — a partial object where you only specify what you want to override:

```ts
type XFramesStyleForPatching = Partial<Omit<XFramesStyle, "colors">> & {
  colors?: {
    [k in ImGuiCol]?: HEXA;
  };
};

type HEXA = [string, number]; // [hexColor, alpha 0.0–1.0]
```

The `colors` property maps `ImGuiCol` enum values to HEXA tuples. You can also override numeric style properties:

```ts
const theme: XFramesStyleForPatching = {
  // Numeric style vars
  windowRounding: 8,
  frameRounding: 4,
  framePadding: [6, 4],       // [x, y]
  itemSpacing: [8, 6],

  // Colors
  colors: {
    [ImGuiCol.Text]: ["#ffffff", 1],
    [ImGuiCol.WindowBg]: ["#1a1a2e", 1],
    [ImGuiCol.FrameBg]: ["#16213e", 0.9],  // 90% opaque
  },
};
```

## Setting the initial theme

Pass your theme as the 4th argument to `render()`:

```tsx
import { render } from "./lib/render";
import { theme2 } from "./themes";

render(App, assetsBasePath, fontDefs, theme2);
```

The theme is serialized to JSON and sent to the C++ core during initialization.

## Runtime theme switching

Call `patchStyle` on the native module to change the theme at runtime. It lives directly on the native module — not on `WidgetRegistrationService`:

```tsx
import { ComboChangeEvent, useWidgetRegistrationService } from "@xframes/common";
import { theme1, theme2, theme3 } from "../themes";

const themeList = [
  { name: "Dark", theme: theme2 },
  { name: "Light", theme: theme1 },
  { name: "Ocean", theme: theme3 },
];

function ThemeSwitcher() {
  const widgetRegistrationService = useWidgetRegistrationService();

  const handleThemeChange = useCallback((event: ComboChangeEvent) => {
    const index = event.nativeEvent.value;
    (widgetRegistrationService as any).wasmModule.patchStyle(
      JSON.stringify(themeList[index].theme),
    );
  }, [widgetRegistrationService]);

  return (
    <XFrames.Combo
      options={themeList.map((t) => t.name)}
      initialSelectedIndex={0}
      onChange={handleThemeChange}
    />
  );
}
```

The style update takes effect on the next render frame — there is no flicker or delay.

## Creating a custom theme

1. **Define your color palette** as a plain object with descriptive names:

```ts
const myColors = {
  bg: "#2b2d42",
  surface: "#3a3d5c",
  text: "#edf2f4",
  accent: "#ef233c",
  accentHover: "#ff4757",
  muted: "#8d99ae",
};
```

2. **Create the theme object**, mapping palette colors to ImGui color slots:

```ts
import { XFramesStyleForPatching, ImGuiCol } from "@xframes/common";

const myTheme: XFramesStyleForPatching = {
  // Optional: override style vars
  windowRounding: 6,
  frameRounding: 4,
  grabRounding: 4,

  colors: {
    // Text
    [ImGuiCol.Text]: [myColors.text, 1],
    [ImGuiCol.TextDisabled]: [myColors.muted, 1],

    // Backgrounds
    [ImGuiCol.WindowBg]: [myColors.bg, 1],
    [ImGuiCol.ChildBg]: [myColors.bg, 1],
    [ImGuiCol.PopupBg]: [myColors.surface, 1],

    // Borders
    [ImGuiCol.Border]: [myColors.muted, 1],
    [ImGuiCol.BorderShadow]: [myColors.bg, 1],

    // Frames (inputs, checkboxes, sliders)
    [ImGuiCol.FrameBg]: [myColors.surface, 1],
    [ImGuiCol.FrameBgHovered]: [myColors.muted, 0.4],
    [ImGuiCol.FrameBgActive]: [myColors.muted, 0.6],

    // Buttons
    [ImGuiCol.Button]: [myColors.accent, 1],
    [ImGuiCol.ButtonHovered]: [myColors.accentHover, 1],
    [ImGuiCol.ButtonActive]: [myColors.bg, 1],

    // Headers (collapsing headers, tree nodes, table headers)
    [ImGuiCol.Header]: [myColors.surface, 1],
    [ImGuiCol.HeaderHovered]: [myColors.muted, 0.5],
    [ImGuiCol.HeaderActive]: [myColors.accent, 1],

    // Tabs
    [ImGuiCol.Tab]: [myColors.surface, 1],
    [ImGuiCol.TabHovered]: [myColors.muted, 0.5],
    [ImGuiCol.TabActive]: [myColors.accent, 1],
    [ImGuiCol.TabUnfocused]: [myColors.surface, 1],
    [ImGuiCol.TabUnfocusedActive]: [myColors.muted, 1],

    // Tables
    [ImGuiCol.TableHeaderBg]: [myColors.surface, 1],
    [ImGuiCol.TableBorderStrong]: [myColors.muted, 1],
    [ImGuiCol.TableBorderLight]: [myColors.surface, 1],
    [ImGuiCol.TableRowBg]: [myColors.bg, 1],
    [ImGuiCol.TableRowBgAlt]: [myColors.surface, 1],

    // Interactive elements
    [ImGuiCol.CheckMark]: [myColors.accent, 1],
    [ImGuiCol.SliderGrab]: [myColors.accent, 1],
    [ImGuiCol.SliderGrabActive]: [myColors.accentHover, 1],

    // Scrollbars
    [ImGuiCol.ScrollbarBg]: [myColors.bg, 1],
    [ImGuiCol.ScrollbarGrab]: [myColors.muted, 1],
    [ImGuiCol.ScrollbarGrabHovered]: [myColors.text, 0.5],
    [ImGuiCol.ScrollbarGrabActive]: [myColors.text, 0.8],

    // Misc
    [ImGuiCol.Separator]: [myColors.muted, 1],
    [ImGuiCol.TextSelectedBg]: [myColors.accent, 0.4],
    [ImGuiCol.ModalWindowDimBg]: [myColors.bg, 0.7],
  },
};
```

3. **Use it** as the initial theme or switch to it at runtime:

```ts
// As initial theme
render(App, assetsBasePath, fontDefs, myTheme);

// Or switch at runtime
(widgetRegistrationService as any).wasmModule.patchStyle(
  JSON.stringify(myTheme),
);
```

:::note
You don't have to set all 53 color slots. `patchStyle` only overrides the colors you specify — the rest keep their current values. However, for a complete theme (used as the initial theme), you should define all slots for a consistent look.
:::

## ImGuiCol reference

All 53 color IDs available in the `ImGuiCol` enum:

### Text & backgrounds

| Enum | Value | Controls |
|------|-------|----------|
| `Text` | 0 | Default text color |
| `TextDisabled` | 1 | Disabled/greyed-out text |
| `WindowBg` | 2 | Window backgrounds |
| `ChildBg` | 3 | Child window backgrounds |
| `PopupBg` | 4 | Popup and tooltip backgrounds |

### Borders

| Enum | Value | Controls |
|------|-------|----------|
| `Border` | 5 | Border lines |
| `BorderShadow` | 6 | Border shadow (usually transparent) |

### Frames (inputs, checkboxes, sliders)

| Enum | Value | Controls |
|------|-------|----------|
| `FrameBg` | 7 | Input field background |
| `FrameBgHovered` | 8 | Input field background on hover |
| `FrameBgActive` | 9 | Input field background when active |

### Title bars

| Enum | Value | Controls |
|------|-------|----------|
| `TitleBg` | 10 | Unfocused title bar |
| `TitleBgActive` | 11 | Focused title bar |
| `TitleBgCollapsed` | 12 | Collapsed title bar |
| `MenuBarBg` | 13 | Menu bar background |

### Scrollbars

| Enum | Value | Controls |
|------|-------|----------|
| `ScrollbarBg` | 14 | Scrollbar track |
| `ScrollbarGrab` | 15 | Scrollbar thumb |
| `ScrollbarGrabHovered` | 16 | Scrollbar thumb on hover |
| `ScrollbarGrabActive` | 17 | Scrollbar thumb when dragging |

### Interactive elements

| Enum | Value | Controls |
|------|-------|----------|
| `CheckMark` | 18 | Checkbox check mark |
| `SliderGrab` | 19 | Slider handle |
| `SliderGrabActive` | 20 | Slider handle when dragging |
| `Button` | 21 | Button background |
| `ButtonHovered` | 22 | Button background on hover |
| `ButtonActive` | 23 | Button background when clicked |

### Headers & separators

| Enum | Value | Controls |
|------|-------|----------|
| `Header` | 24 | Collapsing header, tree node, table header |
| `HeaderHovered` | 25 | Header on hover |
| `HeaderActive` | 26 | Header when clicked |
| `Separator` | 27 | Separator line |
| `SeparatorHovered` | 28 | Separator on hover |
| `SeparatorActive` | 29 | Separator when dragging |

### Resize grips

| Enum | Value | Controls |
|------|-------|----------|
| `ResizeGrip` | 30 | Resize grip (bottom-right of windows) |
| `ResizeGripHovered` | 31 | Resize grip on hover |
| `ResizeGripActive` | 32 | Resize grip when dragging |

### Tabs

| Enum | Value | Controls |
|------|-------|----------|
| `Tab` | 33 | Unselected tab |
| `TabHovered` | 34 | Tab on hover |
| `TabActive` | 35 | Selected/active tab |
| `TabUnfocused` | 36 | Unselected tab in unfocused window |
| `TabUnfocusedActive` | 37 | Selected tab in unfocused window |

### Plots

| Enum | Value | Controls |
|------|-------|----------|
| `PlotLines` | 38 | Line plot default color |
| `PlotLinesHovered` | 39 | Line plot hover highlight |
| `PlotHistogram` | 40 | Histogram bar default color |
| `PlotHistogramHovered` | 41 | Histogram bar hover highlight |

### Tables

| Enum | Value | Controls |
|------|-------|----------|
| `TableHeaderBg` | 42 | Table header row background |
| `TableBorderStrong` | 43 | Outer and header borders |
| `TableBorderLight` | 44 | Inner column/row borders |
| `TableRowBg` | 45 | Row background (even rows) |
| `TableRowBgAlt` | 46 | Alternating row background (odd rows) |

### Selection & navigation

| Enum | Value | Controls |
|------|-------|----------|
| `TextSelectedBg` | 47 | Text selection highlight |
| `DragDropTarget` | 48 | Drag-and-drop target highlight |
| `NavHighlight` | 49 | Keyboard navigation highlight |
| `NavWindowingHighlight` | 50 | Window switching highlight |
| `NavWindowingDimBg` | 51 | Background dim during window switching |
| `ModalWindowDimBg` | 52 | Background dim behind modal windows |

## Next steps

- [General styling concepts](/docs/typescript/style/general-styling-concepts) — per-widget color and style var overrides
- [Base drawing style properties](/docs/typescript/style/base-drawing-style-properties) — backgroundColor, borders, rounding

---
sidebar_position: 3
---

# ImGui Enums

XFrames exposes Dear ImGui and ImPlot C++ enums as TypeScript enums. These are used in [style rules](/docs/typescript/style/general-styling-concepts), [theme definitions](/docs/typescript/style/theming-guide), and plot component props.

```tsx
import { ImGuiCol, ImGuiStyleVar, ImGuiDir, ImPlotMarker, ImPlotScale } from "@xframes/common";
```

## ImGuiCol

53 color IDs used in theme `colors` maps and per-widget style `colors` overrides. See the [Theming guide — ImGuiCol reference](/docs/typescript/style/theming-guide#imgui-col-reference) for the full table.

```tsx
// In a theme definition
colors: {
  [ImGuiCol.Text]: ["#ffffff", 1],
  [ImGuiCol.WindowBg]: ["#1a1a2e", 1],
}

// In a per-widget style rule
colors: {
  [ImGuiCol.Button]: ["#e94560", 1],
  [ImGuiCol.ButtonHovered]: ["#ff6b6b", 1],
}
```

---

## ImGuiStyleVar

32 numeric style properties. Each is either a `float` (single number) or `ImVec2` (object with `x`, `y`).

### Global

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `Alpha` | 0 | float | Global alpha (transparency) |
| `DisabledAlpha` | 1 | float | Alpha for disabled elements |

### Window

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `WindowPadding` | 2 | ImVec2 | Padding inside windows |
| `WindowRounding` | 3 | float | Corner rounding for windows |
| `WindowBorderSize` | 4 | float | Window border thickness |
| `WindowMinSize` | 5 | ImVec2 | Minimum window size |
| `WindowTitleAlign` | 6 | ImVec2 | Title bar text alignment |

### Child windows & popups

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `ChildRounding` | 7 | float | Corner rounding for child windows |
| `ChildBorderSize` | 8 | float | Child window border thickness |
| `PopupRounding` | 9 | float | Corner rounding for popups |
| `PopupBorderSize` | 10 | float | Popup border thickness |

### Frames (inputs, checkboxes, sliders)

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `FramePadding` | 11 | ImVec2 | Padding inside frame elements |
| `FrameRounding` | 12 | float | Corner rounding for frames |
| `FrameBorderSize` | 13 | float | Frame border thickness |

### Spacing

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `ItemSpacing` | 14 | ImVec2 | Spacing between widgets |
| `ItemInnerSpacing` | 15 | ImVec2 | Spacing within composite widgets |
| `IndentSpacing` | 16 | float | Horizontal indent for tree nodes |
| `CellPadding` | 17 | ImVec2 | Padding inside table cells |

### Scrollbar & grab

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `ScrollbarSize` | 18 | float | Scrollbar width |
| `ScrollbarRounding` | 19 | float | Scrollbar corner rounding |
| `GrabMinSize` | 20 | float | Minimum grab handle size |
| `GrabRounding` | 21 | float | Grab handle corner rounding |

### Tabs

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `TabRounding` | 22 | float | Tab corner rounding |
| `TabBorderSize` | 23 | float | Tab border thickness |
| `TabBarBorderSize` | 24 | float | Tab bar border thickness |

### Tables

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `TableAngledHeadersAngle` | 25 | float | Angle for angled table headers |
| `TableAngledHeadersTextAlign` | 26 | ImVec2 | Text alignment in angled headers |

### Text alignment

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `ButtonTextAlign` | 27 | ImVec2 | Text alignment inside buttons |
| `SelectableTextAlign` | 28 | ImVec2 | Text alignment in selectables |

### Separators

| Enum | Value | Type | Description |
|------|-------|------|-------------|
| `SeparatorTextBorderSize` | 29 | float | Separator text border thickness |
| `SeparatorTextAlign` | 30 | ImVec2 | Separator text alignment |
| `SeparatorTextPadding` | 31 | ImVec2 | Separator text padding |

### Usage

```tsx
// float values — single number
vars: {
  [ImGuiStyleVar.FrameRounding]: 8,
  [ImGuiStyleVar.Alpha]: 0.95,
}

// ImVec2 values — { x, y } object
vars: {
  [ImGuiStyleVar.FramePadding]: { x: 16, y: 8 },
  [ImGuiStyleVar.ItemSpacing]: { x: 8, y: 6 },
}
```

---

## ImGuiDir

Direction values used by style properties like `windowMenuButtonPosition` and `colorButtonPosition`.

| Enum | Value | Description |
|------|-------|-------------|
| `None` | -1 | No direction |
| `Left` | 0 | Left |
| `Right` | 1 | Right |
| `Up` | 2 | Up |
| `Down` | 3 | Down |

---

## ImPlotMarker

Marker shapes for plot data points. Used in plot series configuration.

| Enum | Value | Shape |
|------|-------|-------|
| `None` | -1 | No marker |
| `Circle` | 0 | Circle |
| `Square` | 1 | Square |
| `Diamond` | 2 | Diamond |
| `Up` | 3 | Upward triangle |
| `Down` | 4 | Downward triangle |
| `Left` | 5 | Left triangle |
| `Right` | 6 | Right triangle |
| `Cross` | 7 | Cross (×) |
| `Plus` | 8 | Plus (+) |
| `Asterisk` | 9 | Asterisk (*) |

---

## ImPlotScale

Axis scale types for plot axes.

| Enum | Value | Description |
|------|-------|-------------|
| `Linear` | 0 | Linear scale (default) |
| `Time` | 1 | Time/date scale |
| `Log10` | 2 | Base-10 logarithmic scale |
| `SymLog` | 3 | Symmetric logarithmic scale (handles negative values) |

---

## ImPlotColormap

Color palettes for ImPlot visualizations. Used by the PlotHeatmap `colormap` prop. There is no TypeScript enum for this — pass the numeric value directly.

| Name | Value | Description |
|------|-------|-------------|
| Deep | 0 | Default deep colors |
| Dark | 1 | Dark palette |
| Pastel | 2 | Pastel/soft colors |
| Paired | 3 | Paired color scheme |
| Viridis | 4 | Viridis (default for heatmaps) |
| Plasma | 5 | Plasma |
| Hot | 6 | Hot (red-yellow-white) |
| Cool | 7 | Cool (cyan-magenta) |
| Pink | 8 | Pink tones |
| Jet | 9 | Jet (blue-cyan-yellow-red) |
| Twilight | 10 | Twilight |
| RdBu | 11 | Red-Blue diverging |
| BrBG | 12 | Brown-BlueGreen diverging |
| PiYG | 13 | Pink-YellowGreen diverging |
| Spectral | 14 | Spectral |
| Greys | 15 | Greyscale |

```tsx
// Use Plasma colormap for a heatmap
<XFrames.PlotHeatmap ref={ref} colormap={5} scaleMin={0} scaleMax={100} />

// Use Viridis (default)
<XFrames.PlotHeatmap ref={ref} colormap={4} />
```

---

## Next steps

- [Theming guide](/docs/typescript/style/theming-guide) — using ImGuiCol in theme definitions
- [General styling concepts](/docs/typescript/style/general-styling-concepts) — using ImGuiCol and ImGuiStyleVar in per-widget styles

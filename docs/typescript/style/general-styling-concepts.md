---
sidebar_position: 1
---

# General Styling Concepts

XFrames styles combine three layers into a single object:

| Layer | What it controls | Example properties |
|-------|------------------|--------------------|
| **YogaStyle** | Flexbox layout | `flexDirection`, `width`, `padding`, `gap` |
| **BaseDrawStyle** | Visual appearance | `backgroundColor`, `border`, `rounding` |
| **StyleRules** | ImGui-specific | `font`, `colors`, `vars`, `align` |

Widgets use **WidgetStyle** (all three layers). Layout containers like `<XFrames.Node>` use **NodeStyle** (Yoga + BaseDrawStyle only — no font or ImGui overrides).

## RWStyleSheet.create()

Define reusable style objects with `RWStyleSheet.create()`. It provides TypeScript type checking and IDE autocomplete — the object is returned unchanged at runtime.

```tsx
import { RWStyleSheet } from "@xframes/common";

const styles = RWStyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    padding: { all: 8 },
    backgroundColor: "#1a1a2e",
  },
  heading: {
    font: { name: "roboto-bold", size: 24 },
    padding: { bottom: 8 },
  },
  card: {
    flex: 1,
    padding: { all: 12 },
    backgroundColor: "#16213e",
    rounding: 4,
  },
});
```

## Style variants

Every component supports four style variants for interaction states:

| Variant | When applied |
|---------|-------------|
| `style` | Default appearance |
| `hoverStyle` | Mouse hovering over the element |
| `activeStyle` | Element is being clicked/pressed |
| `disabledStyle` | Element is disabled |

Variants **layer on top** of the base style — you only need to specify properties that change:

```tsx
<XFrames.Button
  label="Save"
  style={{
    backgroundColor: "#0f3460",
    rounding: 4,
    padding: { all: 8 },
  }}
  hoverStyle={{
    backgroundColor: "#1a5276",  // only background changes on hover
  }}
  activeStyle={{
    backgroundColor: "#0a2647",  // darker when pressed
  }}
/>
```

## Style composition

Combine predefined styles with inline overrides using the spread operator:

```tsx
const styles = RWStyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    height: 350,
    flexShrink: 0,
  },
});

// Override height for a shorter row
<XFrames.Node style={{ ...styles.row, height: 200 }} />
```

You can also use styles directly inline for one-off cases:

```tsx
<XFrames.Node style={{ flex: 1, padding: { all: 8 } }}>
  <XFrames.UnformattedText text="Inline styled" />
</XFrames.Node>
```

## Colors

Colors are accepted in two formats:

```tsx
// CSS color string
backgroundColor: "#ffffff",
backgroundColor: "rgb(255, 255, 255)",

// HEXA tuple: [hexString, alpha]
backgroundColor: ["#ffffff", 0.8],   // 80% opaque white
backgroundColor: ["#000000", 0.5],   // 50% transparent black
```

The HEXA tuple format is used throughout theme definitions and anywhere you need alpha transparency.

## ImGui colors and style vars

The `colors` and `vars` properties in a style rule let you override Dear ImGui's internal styling:

```tsx
import { ImGuiCol, ImGuiStyleVar } from "@xframes/common";

const styles = RWStyleSheet.create({
  customButton: {
    colors: {
      [ImGuiCol.Button]: ["#e94560", 1],
      [ImGuiCol.ButtonHovered]: ["#ff6b6b", 1],
      [ImGuiCol.ButtonActive]: ["#c0392b", 1],
    },
    vars: {
      [ImGuiStyleVar.FrameRounding]: 8,
      [ImGuiStyleVar.FramePadding]: { x: 16, y: 8 },
    },
  },
});
```

The `ImGuiCol` enum has 53 color IDs (Text, WindowBg, Button, Header, Tab, etc.) and `ImGuiStyleVar` has 29 numeric properties (Alpha, FramePadding, FrameRounding, ItemSpacing, etc.).

## Type reference

```
WidgetStyle = StyleRules + YogaStyle + BaseDrawStyle
  Used by: Button, Checkbox, Combo, InputText, Slider, Table, plots, etc.

NodeStyle = YogaStyle + BaseDrawStyle
  Used by: Node, Child, Group

StyleRules adds:
  font: { name, size }
  colors: { [ImGuiCol]: string | [hex, alpha] }
  vars: { [ImGuiStyleVar]: number | { x, y } }
  align: "left" | "right"
```

## Next steps

- [Base drawing style properties](/docs/typescript/style/base-drawing-style-properties) — backgroundColor, borders, rounding
- [Yoga layout properties](/docs/typescript/style/yoga-layout-properties) — full flexbox property reference

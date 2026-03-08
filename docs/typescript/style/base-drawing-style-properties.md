---
sidebar_position: 2
---

# Base Drawing Style Properties

Visual properties that control background fills, borders, and corner rounding. These are drawn via Dear ImGui's `ImDrawList` and apply to all components (both Nodes and widgets).

## Properties

| Property | Type | Description |
|----------|------|-------------|
| `backgroundColor` | `string \| [string, number]` | Fill color |
| `border` | `BorderStyle` | Border on all sides |
| `borderTop` | `BorderStyle` | Top border only |
| `borderRight` | `BorderStyle` | Right border only |
| `borderBottom` | `BorderStyle` | Bottom border only |
| `borderLeft` | `BorderStyle` | Left border only |
| `rounding` | `number` | Corner radius in pixels |
| `roundCorners` | `RoundCorners[]` | Which corners to round |

## Background color

```tsx
// CSS color string
style={{ backgroundColor: "#1a1a2e" }}

// HEXA tuple with alpha
style={{ backgroundColor: ["#1a1a2e", 0.8] }}
```

Use with hover variants for interactive feedback:

```tsx
<XFrames.Node
  style={{ backgroundColor: "#16213e", padding: { all: 12 } }}
  hoverStyle={{ backgroundColor: "#1a5276" }}
>
  <XFrames.UnformattedText text="Hover me" />
</XFrames.Node>
```

## Borders

A border is defined as `{ color, thickness? }`:

```ts
type BorderStyle = {
  color: string | [string, number];  // CSS color or HEXA tuple
  thickness?: number;                 // pixels, default 1
};
```

### All sides

```tsx
style={{
  border: { color: "#e94560", thickness: 2 },
  padding: { all: 8 },
}}
```

### Per-side borders

```tsx
style={{
  borderBottom: { color: "#e94560", thickness: 2 },
  padding: { all: 8 },
}}
```

```tsx
// Left accent bar
style={{
  borderLeft: { color: "#0f3460", thickness: 4 },
  padding: { left: 12, top: 8, bottom: 8 },
}}
```

You can combine per-side borders:

```tsx
style={{
  borderTop: { color: "#333333" },
  borderBottom: { color: "#333333" },
}}
```

## Rounding

`rounding` sets the corner radius in pixels for all corners:

```tsx
style={{
  backgroundColor: "#16213e",
  rounding: 8,
  padding: { all: 12 },
}}
```

### Selective corners

Use `roundCorners` to round only specific corners:

```tsx
style={{
  backgroundColor: "#16213e",
  rounding: 8,
  roundCorners: ["topLeft", "topRight"],  // only round the top
  padding: { all: 12 },
}}
```

**Available values:** `"all"`, `"topLeft"`, `"topRight"`, `"bottomLeft"`, `"bottomRight"`

If `roundCorners` is not specified, all corners are rounded by default.

## Color formats

Colors are accepted in two formats throughout these properties:

| Format | Example | Description |
|--------|---------|-------------|
| CSS string | `"#ff6e59"` | Standard hex color |
| HEXA tuple | `["#ff6e59", 0.8]` | Hex color with alpha (0.0–1.0) |

Both formats work for `backgroundColor`, `border.color`, and all per-side border colors.

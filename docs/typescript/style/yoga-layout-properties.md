---
sidebar_position: 3
---

# Yoga Layout Properties

Full reference for all [Yoga](https://www.yogalayout.dev/) flexbox properties available in XFrames. For a tutorial-style introduction, see the [Layout guide](/docs/layout-guide).

## Flex container

Properties that control how a container arranges its children.

| Property | Values | Description |
|----------|--------|-------------|
| `flexDirection` | `"column"`, `"row"`, `"column-reverse"`, `"row-reverse"` | Main axis direction. Default: `"column"` |
| `justifyContent` | `"flex-start"`, `"center"`, `"flex-end"`, `"space-between"`, `"space-around"`, `"space-evenly"` | Alignment along the main axis |
| `alignItems` | `"auto"`, `"flex-start"`, `"center"`, `"flex-end"`, `"stretch"`, `"baseline"` | Alignment along the cross axis |
| `alignContent` | `"auto"`, `"flex-start"`, `"center"`, `"flex-end"`, `"stretch"`, `"space-between"`, `"space-around"`, `"space-evenly"` | Alignment of wrapped lines |
| `flexWrap` | `"no-wrap"`, `"wrap"`, `"wrap-reverse"` | Whether children wrap to new lines |

```tsx
{
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
}
```

## Flex item

Properties that control how a child behaves within its container.

| Property | Type | Description |
|----------|------|-------------|
| `flex` | `number` | Shorthand for grow. `flex: 1` fills available space |
| `flexGrow` | `number` | How much the item grows relative to siblings |
| `flexShrink` | `number` | How much the item shrinks. Use `0` to prevent shrinking |
| `flexBasis` | `number` | Initial size before grow/shrink (pixels) |
| `flexBasisPercent` | `number` | Initial size as a percentage |
| `alignSelf` | `"auto"`, `"flex-start"`, `"center"`, `"flex-end"`, `"stretch"`, `"baseline"` | Override parent's `alignItems` for this child |

```tsx
// Two columns: sidebar (1/3) and main (2/3)
sidebar: { flex: 1 },
main: { flex: 2 },
```

## Sizing

| Property | Type | Description |
|----------|------|-------------|
| `width` | `number \| string` | Width in pixels or percentage (`"50%"`) |
| `height` | `number \| string` | Height in pixels or percentage (`"100%"`) |
| `minWidth` | `number \| string` | Minimum width |
| `maxWidth` | `number \| string` | Maximum width |
| `minHeight` | `number \| string` | Minimum height |
| `maxHeight` | `number \| string` | Maximum height |
| `aspectRatio` | `number` | Width-to-height ratio (e.g. `1.0` for square) |

```tsx
{ width: "100%", height: 200 }       // full width, 200px tall
{ width: "50%", aspectRatio: 1.0 }   // half width, square
```

## Spacing

`padding`, `margin`, and `gap` use **object syntax with edge/gutter keys** — not plain numbers.

:::warning
`padding: 8` will **not** work. Always use an object: `padding: { all: 8 }`.
:::

### Edge keys (for padding, margin, position)

| Key | Applies to |
|-----|------------|
| `all` | All four sides |
| `horizontal` | Left and right |
| `vertical` | Top and bottom |
| `left` | Left side only |
| `top` | Top side only |
| `right` | Right side only |
| `bottom` | Bottom side only |
| `start` | Logical start (respects direction) |
| `end` | Logical end (respects direction) |

```tsx
padding: { all: 8 }                        // 8px on every side
padding: { horizontal: 12, vertical: 4 }   // 12px left/right, 4px top/bottom
margin: { bottom: 4 }                      // 4px bottom margin only
padding: { left: 8, right: 8, bottom: 4 }  // individual edges
```

### Gutter keys (for gap)

| Key | Applies to |
|-----|------------|
| `all` | Both directions |
| `column` | Horizontal gap between items |
| `row` | Vertical gap between items |

```tsx
gap: { column: 8 }     // 8px between items in a row
gap: { row: 4 }         // 4px between items in a column
gap: { all: 8 }          // 8px in both directions
```

## Positioning

| Property | Values | Description |
|----------|--------|-------------|
| `positionType` | `"static"`, `"relative"`, `"absolute"` | Positioning mode |
| `position` | Edge object | Offset from edges (used with `relative` or `absolute`) |

```tsx
// Absolute positioning: 10px from top-right corner of parent
{
  positionType: "absolute",
  position: { top: 10, right: 10 },
  width: 100,
  height: 40,
}
```

## Overflow

| Value | Description |
|-------|-------------|
| `"visible"` | Content may overflow the container (default) |
| `"hidden"` | Clip overflowing content |
| `"scroll"` | Show scrollbars when content overflows |

See the [Layout guide — Scroll containers](/docs/layout-guide#scroll-containers) for details on setting up scrollable areas.

## Display

| Value | Description |
|-------|-------------|
| `"flex"` | Normal layout (default) |
| `"none"` | Hide the element and its children |

```tsx
// Conditionally hide an element
style={{ display: showPanel ? "flex" : "none", width: "100%", flex: 1 }}
```

## Direction

| Value | Description |
|-------|-------------|
| `"inherit"` | Inherit from parent (default) |
| `"ltr"` | Left-to-right |
| `"rtl"` | Right-to-left |

Controls the meaning of `start`/`end` edge keys in padding, margin, and position.

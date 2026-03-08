---
sidebar_position: 2
---

# Layout Guide

XFrames uses [Yoga](https://www.yogalayout.dev/) for layout — the same flexbox engine used by React Native. Every layout container is an `<XFrames.Node>`, which works like a `<div>` in HTML. You nest Nodes to build your UI structure.

```tsx
import { RWStyleSheet } from "@xframes/common";
```

## Flex direction

The `flexDirection` property controls the main axis. The default is `"column"` (top to bottom).

```tsx
const styles = RWStyleSheet.create({
  column: {
    flexDirection: "column", // default — children stack vertically
    width: "100%",
    height: 200,
  },
  row: {
    flexDirection: "row", // children arrange horizontally
    width: "100%",
    height: 200,
  },
});
```

Also available: `"column-reverse"` and `"row-reverse"` to reverse the child order.

## Distributing space with flex

Use the `flex` property to distribute available space proportionally between children.

### Equal columns

```tsx
const styles = RWStyleSheet.create({
  row: { flexDirection: "row", width: "100%" },
  column: { flex: 1 },
});

const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.Node style={styles.row}>
      <XFrames.Node style={styles.column}>
        <XFrames.UnformattedText text="Left (50%)" />
      </XFrames.Node>
      <XFrames.Node style={styles.column}>
        <XFrames.UnformattedText text="Right (50%)" />
      </XFrames.Node>
    </XFrames.Node>
  </XFrames.Node>
);
```

### Weighted distribution

```tsx
const styles = RWStyleSheet.create({
  row: { flexDirection: "row", width: "100%" },
  sidebar: { flex: 1 },  // 1/3 of the space
  main: { flex: 2 },     // 2/3 of the space
});
```

## Fixed and percentage sizes

Sizes can be pixel values (numbers) or percentage strings:

```tsx
const styles = RWStyleSheet.create({
  fixedWidth: {
    width: 200,       // 200 pixels
    height: 100,      // 100 pixels
  },
  percentageWidth: {
    width: "50%",     // half of parent
    height: "100%",   // full parent height
  },
});
```

Also available: `minWidth`, `maxWidth`, `minHeight`, `maxHeight` for constraints.

## Padding and margin

Padding and margin use objects with edge keys — not plain numbers.

```tsx
const styles = RWStyleSheet.create({
  allSides: {
    padding: { all: 8 },                    // 8px on every side
  },
  horizontal: {
    padding: { horizontal: 8 },             // 8px left and right
  },
  vertical: {
    margin: { vertical: 4 },               // 4px top and bottom
  },
  mixed: {
    padding: { left: 8, right: 8, bottom: 4 }, // individual edges
  },
  bottomOnly: {
    margin: { bottom: 4 },                 // spacing between stacked items
  },
});
```

:::warning
`padding: 8` will **not** work. Always use an object: `padding: { all: 8 }`.
:::

**Available edge keys:** `left`, `top`, `right`, `bottom`, `start`, `end`, `horizontal`, `vertical`, `all`

## Gap

The `gap` property adds spacing between children without affecting outer edges — cleaner than adding margin to each child.

```tsx
const styles = RWStyleSheet.create({
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    gap: { column: 8 },    // 8px between items horizontally
    padding: { all: 8 },
  },
  list: {
    flexDirection: "column",
    gap: { row: 4 },       // 4px between items vertically
  },
  grid: {
    gap: { all: 8 },       // 8px in both directions
  },
});
```

**Available gutter keys:** `column` (horizontal gap), `row` (vertical gap), `all` (both)

## Alignment

`justifyContent` controls alignment on the **main axis** (the direction of `flexDirection`). `alignItems` controls alignment on the **cross axis**.

```tsx
const styles = RWStyleSheet.create({
  centered: {
    justifyContent: "center",  // center along main axis
    alignItems: "center",      // center along cross axis
    width: "100%",
    height: "100%",
  },
  spaceBetween: {
    flexDirection: "row",
    justifyContent: "space-between", // push items to edges
    alignItems: "center",           // vertically center them
    width: "100%",
  },
});
```

**justifyContent values:** `flex-start`, `center`, `flex-end`, `space-between`, `space-around`, `space-evenly`

**alignItems values:** `flex-start`, `center`, `flex-end`, `stretch`, `baseline`

## Scroll containers

Set `overflow: "scroll"` on a Node to make it scrollable. ImGui shows scrollbars automatically when children overflow the container.

```tsx
const styles = RWStyleSheet.create({
  scrollArea: {
    width: "100%",
    flex: 1,
    overflow: "scroll",
  },
  fixedRow: {
    flexDirection: "row",
    width: "100%",
    height: 350,
    flexShrink: 0,  // prevent Yoga from shrinking this to fit
  },
});

const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.Node style={styles.scrollArea}>
      <XFrames.Node style={styles.fixedRow}>
        <XFrames.UnformattedText text="Row 1" />
      </XFrames.Node>
      <XFrames.Node style={styles.fixedRow}>
        <XFrames.UnformattedText text="Row 2" />
      </XFrames.Node>
      <XFrames.Node style={styles.fixedRow}>
        <XFrames.UnformattedText text="Row 3" />
      </XFrames.Node>
    </XFrames.Node>
  </XFrames.Node>
);
```

:::warning
Children of scroll containers **must** use `flexShrink: 0` with a fixed `height`. Without this, Yoga shrinks children to fit the container and scrollbars never appear.
:::

## Nested layouts

Compose complex layouts by nesting Nodes. Here's a dashboard-style layout with a header, scrollable content, and two-column rows:

```tsx
const styles = RWStyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: { column: 8 },
    padding: { left: 8, right: 8, bottom: 4 },
  },
  scrollArea: {
    width: "100%",
    flex: 1,
    overflow: "scroll",
  },
  row: {
    flexDirection: "row",
    width: "100%",
    height: 350,
    flexShrink: 0,
  },
  left: {
    flex: 1,
    padding: { all: 8 },
  },
  right: {
    flex: 1,
    padding: { all: 8 },
  },
});

const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    {/* Fixed header */}
    <XFrames.Node style={styles.header}>
      <XFrames.UnformattedText text="Dashboard" />
    </XFrames.Node>

    {/* Scrollable content */}
    <XFrames.Node style={styles.scrollArea}>
      <XFrames.Node style={styles.row}>
        <XFrames.Node style={styles.left}>
          <XFrames.UnformattedText text="Table here" />
        </XFrames.Node>
        <XFrames.Node style={styles.right}>
          <XFrames.UnformattedText text="Chart here" />
        </XFrames.Node>
      </XFrames.Node>
      <XFrames.Node style={styles.row}>
        <XFrames.Node style={styles.left}>
          <XFrames.UnformattedText text="Another section" />
        </XFrames.Node>
        <XFrames.Node style={styles.right}>
          <XFrames.UnformattedText text="Another section" />
        </XFrames.Node>
      </XFrames.Node>
    </XFrames.Node>
  </XFrames.Node>
);
```

## Next steps

- [Fonts guide](/docs/fonts-guide) — font definitions, sizes, and Font Awesome icons
- [Yoga layout properties](/docs/typescript/style/yoga-layout-properties) — full type reference for all layout props
- [Styling guide](/docs/typescript/style/general-styling-concepts) — colors, backgrounds, and interaction states

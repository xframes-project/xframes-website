---
sidebar_position: 1
---

# Layout Components

Layout components are containers that structure your UI. They all accept children and support Yoga flexbox styling.

:::note
All layout components support four style variants: `style`, `hoverStyle`, `activeStyle`, `disabledStyle`. See the [Styling guide](/docs/typescript/style/general-styling-concepts) for details.
:::

## Node

The primary layout container — equivalent to `<div>` in HTML or `<View>` in React Native. Every XFrames app starts with a root Node.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `root` | `boolean` | Marks this as the root element. Required on the top-level Node. |
| `trackMouseClickEvents` | `boolean` | Enable click event tracking on this Node |
| `onClick` | `() => void` | Click callback. Requires `trackMouseClickEvents={true}`. |
| `cull` | `boolean` | Enable off-screen culling optimization |

### Example

```tsx
const App = () => {
  const handleClick = useCallback(() => {
    console.log("Clicked!");
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Node
        trackMouseClickEvents
        onClick={handleClick}
        style={{ padding: { all: 8 }, width: 200, height: 100 }}
        hoverStyle={{ backgroundColor: "#333333" }}
      >
        <XFrames.UnformattedText text="Click me" />
      </XFrames.Node>
    </XFrames.Node>
  );
};
```

## Child

A simple layout wrapper. Useful for grouping elements without the extra props of Node.

### Props

Style variants only (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`).

### Example

```tsx
<XFrames.Child style={{ padding: { all: 8 } }}>
  <XFrames.UnformattedText text="Wrapped content" />
</XFrames.Child>
```

## Group

A grouping container, similar to Child. Useful for logically grouping related elements.

### Props

Style variants only (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`).

### Example

```tsx
<XFrames.Group style={{ flexDirection: "row", gap: { column: 8 } }}>
  <XFrames.Button label="Save" />
  <XFrames.Button label="Cancel" />
</XFrames.Group>
```

## DIWindow

A Dear ImGui floating window with a title bar. Can be moved, resized, and collapsed by the user.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | **Required.** Window title text |
| `width` | `number` | Initial width in pixels |
| `height` | `number` | Initial height in pixels |

### Example

```tsx
<XFrames.DIWindow title="Settings" width={400} height={300}>
  <XFrames.UnformattedText text="Window content here" />
  <XFrames.Checkbox label="Enable feature" />
</XFrames.DIWindow>
```

## CollapsingHeader

An expandable/collapsible section. The user clicks the header to show or hide its children. Collapse state is managed internally by ImGui.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Header label text |

### Example

```tsx
<XFrames.CollapsingHeader label="Advanced Settings">
  <XFrames.Checkbox label="Debug mode" />
  <XFrames.Slider label="Timeout" min={0} max={60} />
</XFrames.CollapsingHeader>
```

## ItemTooltip

Displays a tooltip when the user hovers over the preceding sibling element.

### Props

Style variants only (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`).

### Example

```tsx
<XFrames.Button label="Submit" />
<XFrames.ItemTooltip>
  <XFrames.UnformattedText text="Click to submit the form" />
</XFrames.ItemTooltip>
```

## TextWrap

Constrains child text to wrap at a specified pixel width.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `width` | `number` | **Required.** Wrapping width in pixels |

### Example

```tsx
<XFrames.TextWrap width={300}>
  <XFrames.UnformattedText
    text="This is a long paragraph that will wrap at 300 pixels instead of extending off-screen."
  />
</XFrames.TextWrap>
```

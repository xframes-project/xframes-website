---
sidebar_position: 6
---

# Navigation

Components for organizing content into tabs and tree structures.

## TabBar

A tab container. Only accepts `TabItem` children.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `reorderable` | `boolean` | Allow users to drag tabs to reorder them |

All four style variants are supported.

### Example

```tsx
<XFrames.TabBar reorderable style={{ width: "100%", flex: 1 }}>
  <XFrames.TabItem label="Overview" style={{ width: "100%", height: "100%" }}>
    <XFrames.UnformattedText text="Overview content" />
  </XFrames.TabItem>
  <XFrames.TabItem label="Details" style={{ width: "100%", height: "100%" }}>
    <XFrames.UnformattedText text="Details content" />
  </XFrames.TabItem>
</XFrames.TabBar>
```

## TabItem

An individual tab inside a `TabBar`. Accepts any children as tab content.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | **Required.** Tab header text |
| `closeable` | `boolean` | Show a close button on the tab |
| `onChange` | `(event: TabItemChangeEvent) => void` | Fires when the tab's open state changes |

All four style variants are supported.

### Event payload

```ts
{ value: boolean }  // false = tab was closed
```

The tab stays closed on the C++ side until the element is removed from the React tree.

### Example with closeable tabs

```tsx
import { useState, useCallback } from "react";
import { TabItemChangeEvent } from "@xframes/common";

const App = () => {
  const [tabs, setTabs] = useState(["Tab 1", "Tab 2", "Tab 3"]);

  const handleClose = useCallback((label: string) => (event: TabItemChangeEvent) => {
    if (!event.nativeEvent.value) {
      setTabs((prev) => prev.filter((t) => t !== label));
    }
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.TabBar reorderable style={{ width: "100%", flex: 1 }}>
        {tabs.map((label) => (
          <XFrames.TabItem
            key={label}
            label={label}
            closeable
            onChange={handleClose(label)}
            style={{ width: "100%", height: "100%" }}
          >
            <XFrames.UnformattedText text={`Content of ${label}`} />
          </XFrames.TabItem>
        ))}
      </XFrames.TabBar>
    </XFrames.Node>
  );
};
```

## TreeNode

A manually constructed tree node. Nest `TreeNode` elements to build a tree hierarchy. Leaf nodes (no children) should set `leaf={true}`.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `itemId` | `string` | **Required.** Unique identifier for this node |
| `label` | `string` | Display text |
| `leaf` | `boolean` | Mark as leaf node (no expand arrow, children not rendered) |
| `open` | `boolean` | Controlled open state |
| `defaultOpen` | `boolean` | Initial open state |
| `selected` | `boolean` | Controlled selection state |
| `defaultSelected` | `boolean` | Initial selection state |
| `selectable` | `boolean` | Whether the node can be selected |
| `onClick` | `() => void` | Click callback |

All four style variants are supported.

### Example

```tsx
<XFrames.Node root style={{ height: "100%" }}>
  <XFrames.TreeNode itemId="src" label="src" defaultOpen selectable>
    <XFrames.TreeNode itemId="components" label="components" selectable>
      <XFrames.TreeNode itemId="app" label="App.tsx" leaf selectable />
      <XFrames.TreeNode itemId="header" label="Header.tsx" leaf selectable />
    </XFrames.TreeNode>
    <XFrames.TreeNode itemId="index" label="index.tsx" leaf selectable />
  </XFrames.TreeNode>
</XFrames.Node>
```

## TreeView

A data-driven tree that renders from an `items` array. No JSX children — the tree structure is defined entirely by the data.

### TreeViewItem type

```ts
type TreeViewItem = {
  itemId: string;
  label: string;
  childItems?: TreeViewItem[];
};
```

### Props

| Prop | Type | Description |
|------|------|-------------|
| `items` | `TreeViewItem[]` | **Required.** Tree data |
| `defaultSelectedItemIds` | `string[]` | Initially selected node IDs |
| `selectedItemIds` | `string[]` | Controlled selection state |
| `allowMultipleSelection` | `boolean` | Allow selecting multiple nodes |
| `onToggleItemSelection` | `(itemId: string, selected: boolean) => void` | Fires when a node's selection changes |

### Example

```tsx
import { useCallback } from "react";

const items = [
  {
    itemId: "docs",
    label: "Documentation",
    childItems: [
      { itemId: "api", label: "API Reference" },
      { itemId: "guide", label: "Getting Started" },
    ],
  },
  {
    itemId: "examples",
    label: "Examples",
    childItems: [
      { itemId: "basic", label: "Basic Example" },
      { itemId: "advanced", label: "Advanced Example" },
    ],
  },
];

const App = () => {
  const handleSelection = useCallback((itemId: string, selected: boolean) => {
    console.log(`${itemId}: ${selected ? "selected" : "deselected"}`);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.TreeView
        items={items}
        defaultSelectedItemIds={["api"]}
        onToggleItemSelection={handleSelection}
      />
    </XFrames.Node>
  );
};
```

:::tip
Use **TreeView** when your tree data comes from an array (e.g. an API response). Use **TreeNode** when you want to build the tree declaratively in JSX with full control over each node.
:::

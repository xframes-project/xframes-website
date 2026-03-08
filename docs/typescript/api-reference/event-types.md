---
sidebar_position: 1
---

# Event Types

XFrames events follow the React synthetic event pattern. Event data is available on `event.nativeEvent`. All event types are imported from `@xframes/common`.

```tsx
import {
  CheckboxChangeEvent,
  ComboChangeEvent,
  InputTextChangeEvent,
  SliderChangeEvent,
  MultiSliderChangeEvent,
  TabItemChangeEvent,
  TableSortEvent,
  TableFilterEvent,
  TableRowClickEvent,
  TableItemActionEvent,
} from "@xframes/common";
```

## Form control events

Form controls use the `onChange` prop. Each widget has its own event type with a specific `nativeEvent` shape.

### CheckboxChangeEvent

Fired when a checkbox is toggled.

| Field | Type | Description |
|-------|------|-------------|
| `value` | `boolean` | The new checked state |

```tsx
const handleChange = useCallback((event: CheckboxChangeEvent) => {
  console.log("Checked:", event.nativeEvent.value);
}, []);

<XFrames.Checkbox label="Enable" defaultChecked={false} onChange={handleChange} />
```

### InputTextChangeEvent

Fired when text content changes. Used by both InputText and ColorPicker.

| Field | Type | Description |
|-------|------|-------------|
| `value` | `string` | The current text value |

```tsx
const handleChange = useCallback((event: InputTextChangeEvent) => {
  console.log("Text:", event.nativeEvent.value);
}, []);

<XFrames.InputText defaultValue="" onChange={handleChange} />
```

**Components:** InputText, ColorPicker

### ComboChangeEvent

Fired when a different option is selected in a dropdown.

| Field | Type | Description |
|-------|------|-------------|
| `value` | `number` | Zero-based index of the selected option |

```tsx
const options = ["Red", "Green", "Blue"];

const handleChange = useCallback((event: ComboChangeEvent) => {
  const selected = options[event.nativeEvent.value];
  console.log("Selected:", selected);
}, []);

<XFrames.Combo options={options} initialSelectedIndex={0} onChange={handleChange} />
```

### SliderChangeEvent

Fired when a slider value changes.

| Field | Type | Description |
|-------|------|-------------|
| `value` | `number` | The new slider value |

```tsx
const handleChange = useCallback((event: SliderChangeEvent) => {
  console.log("Value:", event.nativeEvent.value);
}, []);

<XFrames.Slider
  defaultValue={50}
  min={0}
  max={100}
  sliderType="default"
  onChange={handleChange}
/>
```

### MultiSliderChangeEvent

Fired when any handle in a multi-slider changes.

| Field | Type | Description |
|-------|------|-------------|
| `values` | `Primitive[]` | Array of all slider values (2, 3, or 4 elements) |

```tsx
const handleChange = useCallback((event: MultiSliderChangeEvent) => {
  const [r, g, b] = event.nativeEvent.values;
  console.log("RGB:", r, g, b);
}, []);

<XFrames.MultiSlider
  numValues={3}
  defaultValues={[128, 128, 128]}
  min={0}
  max={255}
  onChange={handleChange}
/>
```

### TabItemChangeEvent

Fired when a closeable tab's open state changes.

| Field | Type | Description |
|-------|------|-------------|
| `value` | `boolean` | `false` when the tab is closed via the close button |

```tsx
const [showTab, setShowTab] = useState(true);

const handleChange = useCallback((event: TabItemChangeEvent) => {
  if (!event.nativeEvent.value) {
    setShowTab(false);
  }
}, []);

<XFrames.TabItem label="Notes" closeable onChange={handleChange}>
  {/* tab content */}
</XFrames.TabItem>
```

## Table events

Table has four dedicated event types, each with its own prop name.

### TableSortEvent

Fired when the user clicks a column header to sort. Sorting is handled internally by ImGui — this event is informational.

**Prop:** `onSort`

| Field | Type | Description |
|-------|------|-------------|
| `columnIndex` | `number` | Index of the sorted column |
| `sortDirection` | `number` | Sort direction (ascending or descending) |

```tsx
const handleSort = useCallback((event: TableSortEvent) => {
  console.log(`Column ${event.nativeEvent.columnIndex} sorted, direction: ${event.nativeEvent.sortDirection}`);
}, []);

<XFrames.Table columns={columns} data={data} onSort={handleSort} />
```

### TableFilterEvent

Fired when a column filter value changes. Filtering is handled internally — this event is informational.

**Prop:** `onFilter`

| Field | Type | Description |
|-------|------|-------------|
| `columnIndex` | `number` | Index of the filtered column |
| `filterText` | `string` | The current filter text |

```tsx
const handleFilter = useCallback((event: TableFilterEvent) => {
  console.log(`Column ${event.nativeEvent.columnIndex} filter: "${event.nativeEvent.filterText}"`);
}, []);

<XFrames.Table columns={columns} data={data} filterable onFilter={handleFilter} />
```

### TableRowClickEvent

Fired when a table row is clicked.

**Prop:** `onRowClick`

| Field | Type | Description |
|-------|------|-------------|
| `rowIndex` | `number` | Zero-based index of the clicked row |

```tsx
const handleRowClick = useCallback((event: TableRowClickEvent) => {
  console.log(`Row clicked: ${event.nativeEvent.rowIndex}`);
}, []);

<XFrames.Table columns={columns} data={data} onRowClick={handleRowClick} />
```

### TableItemActionEvent

Fired when a context menu item is clicked on a table row. Requires the `contextMenuItems` prop.

**Prop:** `onItemAction`

| Field | Type | Description |
|-------|------|-------------|
| `rowIndex` | `number` | Zero-based index of the row |
| `actionId` | `string` | The `id` of the clicked menu item |

```tsx
const menuItems = [
  { id: "edit", label: "Edit" },
  { id: "delete", label: "Delete" },
];

const handleAction = useCallback((event: TableItemActionEvent) => {
  const { rowIndex, actionId } = event.nativeEvent;
  console.log(`Action "${actionId}" on row ${rowIndex}`);
}, []);

<XFrames.Table
  columns={columns}
  data={data}
  contextMenuItems={menuItems}
  onItemAction={handleAction}
/>
```

## Simple callbacks

Some components use plain callback props instead of synthetic events:

| Prop | Signature | Components |
|------|-----------|------------|
| `onClick` | `() => void` | Button, TreeNode, Node |

```tsx
<XFrames.Button label="Save" onClick={() => console.log("clicked")} />
```

## Next steps

- [Form controls](/docs/typescript/components/form-controls) — component props and usage
- [Table](/docs/typescript/components/table) — full table configuration guide
- [Navigation](/docs/typescript/components/navigation) — TabBar, TabItem, TreeNode, TreeView

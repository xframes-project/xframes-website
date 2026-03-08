---
sidebar_position: 5
---

# Table

A feature-rich data table with sorting, filtering, row selection, column reordering/visibility, and context menus. All table operations (sorting, filtering, reordering) are handled C++-side by Dear ImGui — the JS event callbacks are informational.

## Basic usage

```tsx
import { useRef, useEffect } from "react";
import { TableImperativeHandle } from "@xframes/common";

const columns = [
  { heading: "Name", fieldId: "name" },
  { heading: "Age", fieldId: "age", type: "number" as const },
];

const App = () => {
  const tableRef = useRef<TableImperativeHandle>(null);

  useEffect(() => {
    tableRef.current?.setTableData([
      { name: "Alice", age: 30 },
      { name: "Bob", age: 25 },
    ]);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Table
        ref={tableRef}
        columns={columns}
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `columns` | `ColumnConfig[]` | **Required.** Column definitions |
| `clipRows` | `number` | Number of visible rows before scrolling |
| `filterable` | `boolean` | Show per-column filter inputs |
| `reorderable` | `boolean` | Allow column drag-to-reorder |
| `hideable` | `boolean` | Allow column visibility toggles |
| `contextMenuItems` | `{ id: string; label: string }[]` | Right-click menu options for rows |
| `onSort` | `(event: TableSortEvent) => void` | Fires when a column is sorted |
| `onFilter` | `(event: TableFilterEvent) => void` | Fires when a column filter changes |
| `onRowClick` | `(event: TableRowClickEvent) => void` | Fires when a row is clicked |
| `onItemAction` | `(event: TableItemActionEvent) => void` | Fires when a context menu item is clicked |

All four style variants are supported (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`).

## Column configuration

Each entry in the `columns` array configures one column:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `heading` | `string` | — | **Required.** Column header label |
| `fieldId` | `string` | — | Key matching row data objects |
| `type` | `"string" \| "number" \| "boolean"` | `"string"` | Data type — affects display and filtering |
| `defaultHide` | `boolean` | `false` | Hidden by default (requires `hideable` on table) |
| `defaultSort` | `boolean` | `false` | Sorted by default on first render |
| `widthFixed` | `boolean` | `false` | Fixed column width |
| `noSort` | `boolean` | `false` | Disable sorting on this column |
| `noResize` | `boolean` | `false` | Disable column resize |
| `noReorder` | `boolean` | `false` | Disable column reorder |
| `noHide` | `boolean` | `false` | Pin column — cannot be hidden |

```tsx
const columns = [
  { heading: "City", fieldId: "city", noHide: true },
  { heading: "Country", fieldId: "country" },
  { heading: "Population", fieldId: "population", type: "number" as const },
  { heading: "Area (km²)", fieldId: "area", type: "number" as const, defaultHide: true },
  { heading: "Megacity", fieldId: "megacity", type: "boolean" as const },
];
```

## Data format

Data is an array of objects where keys match column `fieldId` values:

```tsx
const data = [
  { city: "Tokyo", country: "Japan", population: 37400068, area: 2191, megacity: true },
  { city: "Delhi", country: "India", population: 30290936, area: 1484, megacity: true },
  { city: "Zurich", country: "Switzerland", population: 421878, area: 88, megacity: false },
];

tableRef.current?.setTableData(data);
```

## Typed cells

The `type` field on a column controls how values are displayed and filtered:

| Type | Display | Filter |
|------|---------|--------|
| `"string"` | Plain text | Text input — comma-separated includes, `-` prefix excludes |
| `"number"` | Formatted number | Text input — matches against the formatted display value |
| `"boolean"` | Font Awesome icons (check/xmark) | Dropdown — All / Yes / No |

## Sorting and filtering

Sorting and filtering are handled entirely C++-side. The `onSort` and `onFilter` callbacks are informational — use them for logging or syncing external state, not for performing the sort/filter yourself.

```tsx
import { TableSortEvent, TableFilterEvent } from "@xframes/common";

const handleSort = useCallback((event: TableSortEvent) => {
  const { columnIndex, sortDirection } = event.nativeEvent;
  console.log(`Sorted column ${columnIndex}, direction: ${sortDirection}`);
}, []);

const handleFilter = useCallback((event: TableFilterEvent) => {
  const { columnIndex, filterText } = event.nativeEvent;
  console.log(`Filtered column ${columnIndex}: "${filterText}"`);
}, []);
```

:::note
Enable filtering with the `filterable` prop on the Table. Each column automatically gets the appropriate filter UI based on its `type`.
:::

## Row selection

Click a row to select it. The `onRowClick` callback provides the row index:

```tsx
import { TableRowClickEvent } from "@xframes/common";

const handleRowClick = useCallback((event: TableRowClickEvent) => {
  console.log(`Clicked row: ${event.nativeEvent.rowIndex}`);
}, []);

<XFrames.Table ref={tableRef} columns={columns} onRowClick={handleRowClick} />
```

## Column reordering and visibility

- **`reorderable`** — Users can drag column headers to reorder them.
- **`hideable`** — Users can toggle column visibility via the column context menu.

When `hideable` is set, all columns become hideable by default. Use `noHide: true` on individual columns to pin them:

```tsx
const columns = [
  { heading: "ID", fieldId: "id", noHide: true },     // Always visible
  { heading: "Name", fieldId: "name" },                 // Can be hidden
  { heading: "Notes", fieldId: "notes", defaultHide: true }, // Hidden by default
];

<XFrames.Table ref={tableRef} columns={columns} hideable reorderable />
```

## Context menus

Set `contextMenuItems` to show a right-click menu on table rows. The `onItemAction` callback fires with the row index and the selected action ID:

```tsx
import { TableItemActionEvent } from "@xframes/common";

const handleItemAction = useCallback((event: TableItemActionEvent) => {
  const { rowIndex, actionId } = event.nativeEvent;
  console.log(`Action "${actionId}" on row ${rowIndex}`);
}, []);

<XFrames.Table
  ref={tableRef}
  columns={columns}
  contextMenuItems={[
    { id: "view", label: "View Details" },
    { id: "delete", label: "Delete" },
  ]}
  onItemAction={handleItemAction}
/>
```

## Imperative handle

Load and manage table data programmatically via the ref:

| Method | Signature | Description |
|--------|-----------|-------------|
| `setTableData` | `(data: any[]) => void` | Replace the entire dataset |
| `appendDataToTable` | `(data: any[]) => void` | Append rows to existing data |
| `setColumnFilter` | `(columnIndex: number, filterText: string) => void` | Set a column filter programmatically |
| `clearFilters` | `() => void` | Clear all active filters |

```tsx
import { useRef } from "react";
import { TableImperativeHandle } from "@xframes/common";

const tableRef = useRef<TableImperativeHandle>(null);

// Replace all data
tableRef.current?.setTableData(newData);

// Append rows
tableRef.current?.appendDataToTable(additionalRows);

// Filter column 2 to "USA"
tableRef.current?.setColumnFilter(2, "USA");

// Clear all filters
tableRef.current?.clearFilters();
```

## Events reference

All event types are imported from `@xframes/common`. Payloads are accessed via `event.nativeEvent`.

| Event Type | Payload |
|-----------|---------|
| `TableSortEvent` | `{ columnIndex: number; sortDirection: number }` |
| `TableFilterEvent` | `{ columnIndex: number; filterText: string }` |
| `TableRowClickEvent` | `{ rowIndex: number }` |
| `TableItemActionEvent` | `{ rowIndex: number; actionId: string }` |

## Complete example

```tsx
import { useRef, useEffect, useCallback } from "react";
import {
  TableImperativeHandle,
  TableRowClickEvent,
  TableItemActionEvent,
  RWStyleSheet,
} from "@xframes/common";

const columns = [
  { heading: "City", fieldId: "city", noHide: true },
  { heading: "Country", fieldId: "country" },
  { heading: "Population", fieldId: "population", type: "number" as const },
  { heading: "Megacity", fieldId: "megacity", type: "boolean" as const },
];

const cities = [
  { city: "Tokyo", country: "Japan", population: 37400068, megacity: true },
  { city: "Delhi", country: "India", population: 30290936, megacity: true },
  { city: "Zurich", country: "Switzerland", population: 421878, megacity: false },
];

const styles = RWStyleSheet.create({
  table: { width: "100%", flex: 1 },
});

const App = () => {
  const tableRef = useRef<TableImperativeHandle>(null);

  useEffect(() => {
    tableRef.current?.setTableData(cities);
  }, []);

  const handleRowClick = useCallback((event: TableRowClickEvent) => {
    console.log(`Selected row: ${event.nativeEvent.rowIndex}`);
  }, []);

  const handleAction = useCallback((event: TableItemActionEvent) => {
    const { rowIndex, actionId } = event.nativeEvent;
    console.log(`Action "${actionId}" on row ${rowIndex}`);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Table
        ref={tableRef}
        columns={columns}
        clipRows={20}
        filterable
        reorderable
        hideable
        onRowClick={handleRowClick}
        contextMenuItems={[
          { id: "view", label: "View Details" },
          { id: "delete", label: "Delete" },
        ]}
        onItemAction={handleAction}
        style={styles.table}
      />
    </XFrames.Node>
  );
};
```

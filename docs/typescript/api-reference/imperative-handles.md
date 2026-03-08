---
sidebar_position: 2
---

# Imperative Handles

Imperative handles are a key performance feature of XFrames. They let you push data directly from JavaScript into the C++ rendering core, bypassing React's reconciliation entirely — no virtual DOM diffing, no re-renders. The data goes straight to ImGui.

This matters because ImGui only renders what is visible in the viewport. A Table with a large dataset renders at the same speed as one with ten rows — only the visible rows are drawn each frame. The same applies to plots: data is stored in C++ vectors and rendered natively by ImPlot. You can incrementally stream data via `appendData` calls over time and the UI stays responsive throughout.

## Usage pattern

```tsx
import { useRef, useCallback } from "react";
import { TableImperativeHandle } from "@xframes/common";

function MyComponent() {
  const tableRef = useRef<TableImperativeHandle>(null);

  const loadData = useCallback(() => {
    // This data goes directly to C++ — no React re-renders
    tableRef.current?.setTableData(data);
  }, []);

  return <XFrames.Table ref={tableRef} columns={columns} initialData={[]} />;
}
```

All handle types are imported from `@xframes/common`.

---

## Table

### TableImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setTableData` | `data: any[]` | Replace all table rows |
| `appendDataToTable` | `data: any[]` | Append rows to existing data |
| `setColumnFilter` | `columnIndex: number, filterText: string` | Set filter for a specific column |
| `clearFilters` | — | Clear all active column filters |

```tsx
const ref = useRef<TableImperativeHandle>(null);

// Replace data
ref.current?.setTableData([{ city: "Tokyo", pop: "37400068" }]);

// Append rows
ref.current?.appendDataToTable([{ city: "Delhi", pop: "30290936" }]);

// Filter column 0
ref.current?.setColumnFilter(0, "Tokyo");

// Clear all filters
ref.current?.clearFilters();
```

---

## Plots

### PlotLineImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `appendData` | `x: number, y: number` | Append point to the first series |
| `appendSeriesData` | `seriesIndex: number, x: number, y: number` | Append point to a specific series |
| `setData` | `seriesData: { data: { x: number; y: number }[] }[]` | Replace all series data |
| `setAxesDecimalDigits` | `x: number, y: number` | Set decimal precision for axis labels |
| `setAxesAutoFit` | `enabled: boolean` | Enable/disable auto-fit axes to data range |
| `resetData` | — | Clear all data |

```tsx
const ref = useRef<PlotLineImperativeHandle>(null);

// Single-series streaming
ref.current?.appendData(Date.now(), sensorValue);

// Multi-series batch update
ref.current?.setData([
  { data: [{ x: 0, y: 1 }, { x: 1, y: 3 }] },  // series 0
  { data: [{ x: 0, y: 2 }, { x: 1, y: 1 }] },  // series 1
]);
```

### PlotBarImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setData` | `data: { x: number; y: number }[]` | Replace all bars (x = position, y = height) |
| `appendData` | `x: number, y: number` | Append a single bar |
| `setAxesAutoFit` | `enabled: boolean` | Enable/disable auto-fit axes |
| `resetData` | — | Clear all data |

```tsx
const ref = useRef<PlotBarImperativeHandle>(null);

ref.current?.setData([
  { x: 0, y: 10 },
  { x: 1, y: 25 },
  { x: 2, y: 15 },
]);
```

### PlotScatterImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setData` | `data: { x: number; y: number }[]` | Replace all scatter points |
| `appendData` | `x: number, y: number` | Append a single point |
| `setAxesAutoFit` | `enabled: boolean` | Enable/disable auto-fit axes |
| `resetData` | — | Clear all data |

```tsx
const ref = useRef<PlotScatterImperativeHandle>(null);

ref.current?.setData([
  { x: 1.5, y: 2.3 },
  { x: 3.1, y: 4.7 },
]);
```

### PlotHeatmapImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setData` | `rows: number, cols: number, values: number[]` | Set grid data (flat row-major array) |
| `setAxesAutoFit` | `enabled: boolean` | Enable/disable auto-fit axes |
| `resetData` | — | Clear all data |

The `values` array is a flat 1D array in row-major order with `rows × cols` elements. Bounds are set to `(0,0)–(cols,rows)` so cells map 1:1 to plot coordinates.

```tsx
const ref = useRef<PlotHeatmapImperativeHandle>(null);

// 3×3 grid
ref.current?.setData(3, 3, [
  10, 20, 30,
  40, 50, 60,
  70, 80, 90,
]);
```

### PlotHistogramImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setData` | `values: number[]` | Replace raw values (auto-binned per `bins` prop) |
| `appendData` | `value: number` | Append a single value |
| `setAxesAutoFit` | `enabled: boolean` | Enable/disable auto-fit axes |
| `resetData` | — | Clear all data |

Unlike PlotBar which takes explicit X/Y pairs, histogram takes raw values and bins them automatically.

```tsx
const ref = useRef<PlotHistogramImperativeHandle>(null);

ref.current?.setData([1.2, 2.3, 2.8, 3.1, 3.5, 4.0, 4.2]);
ref.current?.appendData(5.1);
```

### PlotPieChartImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setData` | `data: { label: string; value: number }[]` | Set pie slices (label + value pairs) |
| `resetData` | — | Clear all data |

Batch-only — no `appendData`. The chart renders with equal aspect ratio.

```tsx
const ref = useRef<PlotPieChartImperativeHandle>(null);

ref.current?.setData([
  { label: "Desktop", value: 65 },
  { label: "Mobile", value: 30 },
  { label: "Tablet", value: 5 },
]);
```

### PlotCandlestickImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setData` | `data: PlotCandlestickDataItem[]` | Set OHLC candlestick data |
| `setAxesAutoFit` | `enabled: boolean` | Enable/disable auto-fit axes |
| `resetData` | — | Clear all data |

Each data item has the shape:

```ts
type PlotCandlestickDataItem = {
  date: number;   // Unix timestamp
  open: number;
  close: number;
  low: number;
  high: number;
};
```

```tsx
const ref = useRef<PlotCandlestickImperativeHandle>(null);

ref.current?.setData([
  { date: 1704067200, open: 100, close: 105, low: 98, high: 108 },
  { date: 1704153600, open: 105, close: 102, low: 99, high: 107 },
]);
```

---

## Form controls

### ComboImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setSelectedIndex` | `index: number` | Set the selected option by zero-based index |

```tsx
const ref = useRef<ComboImperativeHandle>(null);

<XFrames.Combo ref={ref} options={["Option A", "Option B"]} initialSelectedIndex={0} />

// Programmatically select "Option B"
ref.current?.setSelectedIndex(1);
```

### InputTextImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `setValue` | `value: string` | Set the input text value |

```tsx
const ref = useRef<InputTextImperativeHandle>(null);

<XFrames.InputText ref={ref} defaultValue="" onChange={handleChange} />

// Programmatically set text
ref.current?.setValue("Hello World");
```

---

## Other

### ImageImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `reload` | — | Force reload the image from its current URL |

```tsx
const ref = useRef<ImageImperativeHandle>(null);

<XFrames.Image ref={ref} url="https://example.com/chart.png" />

ref.current?.reload();
```

### ClippedMultiLineTextRendererImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `appendTextToClippedMultiLineTextRenderer` | `data: string` | Append text to the renderer |

```tsx
const ref = useRef<ClippedMultiLineTextRendererImperativeHandle>(null);

<XFrames.ClippedMultiLineTextRenderer ref={ref} />

ref.current?.appendTextToClippedMultiLineTextRenderer("Log line 1\n");
```

### MapImperativeHandle

| Method | Parameters | Description |
|--------|-----------|-------------|
| `render` | `centerX: number, centerY: number, zoom: number` | Render map at given center coordinates and zoom level |

```tsx
const ref = useRef<MapImperativeHandle>(null);

<XFrames.MapView ref={ref} />

// Center on New York at zoom 12
ref.current?.render(40.7128, -74.006, 12);
```

---

## Next steps

- [Event types](/docs/typescript/api-reference/event-types) — all event types and their payloads
- [Plots](/docs/typescript/components/plots) — plot component props and configuration
- [Table](/docs/typescript/components/table) — full table configuration guide

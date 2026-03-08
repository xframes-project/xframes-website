---
sidebar_position: 7
---

# Plots

XFrames wraps [ImPlot](https://github.com/epezent/implot) for GPU-accelerated charting. All plot components use imperative handles to load and stream data — there are no data props.

:::note
All plot components support four style variants (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`) and auto-generate their own internal IDs.
:::

## Common props

Most plot types share these props:

| Prop | Type | Description |
|------|------|-------------|
| `axisAutoFit` | `boolean` | Automatically scale axes to fit data |
| `dataPointsLimit` | `number` | Max data points before old data is culled |
| `xAxisLabel` | `string` | X-axis label text |
| `yAxisLabel` | `string` | Y-axis label text |
| `showLegend` | `boolean` | Show the plot legend |
| `legendLocation` | `number` | Legend position (ImPlot location enum) |
| `legendLabel` | `string` | Legend title text |

## PlotLine

Line chart with optional multi-series support and real-time streaming.

### Additional props

| Prop | Type | Description |
|------|------|-------------|
| `series` | `{ label: string; markerStyle?: ImPlotMarker }[]` | Series definitions for multi-series mode |
| `markerStyle` | `ImPlotMarker` | Marker type for single-series mode |
| `xAxisScale` | `ImPlotScale` | X-axis scale (`Linear`, `Time`, `Log10`, `SymLog`) |
| `yAxisScale` | `ImPlotScale` | Y-axis scale |
| `xAxisDecimalDigits` | `number` | Decimal places for X-axis labels |
| `yAxisDecimalDigits` | `number` | Decimal places for Y-axis labels |

### Imperative handle

```tsx
import { PlotLineImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `setData` | `(seriesData: { data: { x: number; y: number }[] }[]) => void` | Set all series data at once |
| `appendData` | `(x: number, y: number) => void` | Append a point to the first series |
| `appendSeriesData` | `(seriesIndex: number, x: number, y: number) => void` | Append a point to a specific series |
| `setAxesDecimalDigits` | `(x: number, y: number) => void` | Set decimal places for both axes |
| `setAxesAutoFit` | `(enabled: boolean) => void` | Toggle auto-fit |
| `resetData` | `() => void` | Clear all data |

### Streaming example

```tsx
import { useRef, useEffect } from "react";
import { PlotLineImperativeHandle } from "@xframes/common";

const App = () => {
  const plotRef = useRef<PlotLineImperativeHandle>(null);

  useEffect(() => {
    let x = 0;
    const interval = setInterval(() => {
      plotRef.current?.appendSeriesData(0, x, Math.sin(x * 0.1));
      plotRef.current?.appendSeriesData(1, x, Math.cos(x * 0.1));
      x++;
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.PlotLine
        ref={plotRef}
        series={[
          { label: "Sin" },
          { label: "Cos" },
        ]}
        axisAutoFit
        dataPointsLimit={500}
        xAxisLabel="Time"
        yAxisLabel="Value"
        showLegend
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

## PlotBar

Bar chart with X positions and Y heights.

### Imperative handle

```tsx
import { PlotBarImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `setData` | `(data: { x: number; y: number }[]) => void` | Set bar data |
| `appendData` | `(x: number, y: number) => void` | Append a bar |
| `setAxesAutoFit` | `(enabled: boolean) => void` | Toggle auto-fit |
| `resetData` | `() => void` | Clear all data |

### Example

```tsx
import { useRef, useEffect } from "react";
import { PlotBarImperativeHandle } from "@xframes/common";

const App = () => {
  const barRef = useRef<PlotBarImperativeHandle>(null);

  useEffect(() => {
    barRef.current?.setData([
      { x: 1, y: 45 },
      { x: 2, y: 72 },
      { x: 3, y: 58 },
      { x: 4, y: 91 },
      { x: 5, y: 36 },
    ]);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.PlotBar
        ref={barRef}
        axisAutoFit
        xAxisLabel="Category"
        yAxisLabel="Count"
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

## PlotScatter

Scatter plot. Same data model and API as PlotBar.

### Imperative handle

```tsx
import { PlotScatterImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `setData` | `(data: { x: number; y: number }[]) => void` | Set scatter data |
| `appendData` | `(x: number, y: number) => void` | Append a point |
| `setAxesAutoFit` | `(enabled: boolean) => void` | Toggle auto-fit |
| `resetData` | `() => void` | Clear all data |

### Example

```tsx
import { useRef, useEffect } from "react";
import { PlotScatterImperativeHandle } from "@xframes/common";

const App = () => {
  const scatterRef = useRef<PlotScatterImperativeHandle>(null);

  useEffect(() => {
    const data = [];
    for (let i = 0; i < 100; i++) {
      data.push({
        x: Math.cos(i * 0.1) * 10 + Math.random() * 4 - 2,
        y: Math.sin(i * 0.1) * 10 + Math.random() * 4 - 2,
      });
    }
    scatterRef.current?.setData(data);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.PlotScatter
        ref={scatterRef}
        axisAutoFit
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

## PlotHeatmap

Grid heatmap with a color scale. Uses a flat row-major array instead of X/Y pairs.

### Additional props

| Prop | Type | Description |
|------|------|-------------|
| `scaleMin` | `number` | Color scale minimum (0 = auto) |
| `scaleMax` | `number` | Color scale maximum (0 = auto) |
| `colormap` | `number` | ImPlot colormap enum (default: Viridis) |

### Imperative handle

```tsx
import { PlotHeatmapImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `setData` | `(rows: number, cols: number, values: number[]) => void` | Set heatmap data (flat row-major array) |
| `setAxesAutoFit` | `(enabled: boolean) => void` | Toggle auto-fit |
| `resetData` | `() => void` | Clear all data |

No `appendData` — heatmaps are batch-only.

### Example

```tsx
import { useRef, useEffect } from "react";
import { PlotHeatmapImperativeHandle } from "@xframes/common";

const App = () => {
  const heatmapRef = useRef<PlotHeatmapImperativeHandle>(null);

  useEffect(() => {
    const rows = 8, cols = 8;
    const values: number[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        values.push(Math.sin(r * 0.5) * Math.cos(c * 0.5) * 50 + 50);
      }
    }
    heatmapRef.current?.setData(rows, cols, values);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.PlotHeatmap
        ref={heatmapRef}
        scaleMin={0}
        scaleMax={100}
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

## PlotHistogram

Auto-binned distribution plot. Takes raw values (not X/Y pairs) and bins them automatically.

### Additional props

| Prop | Type | Description |
|------|------|-------------|
| `bins` | `number` | Bin count. Positive = explicit count, negative = algorithm (default: Sturges) |

### Imperative handle

```tsx
import { PlotHistogramImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `setData` | `(values: number[]) => void` | Set raw values to bin |
| `appendData` | `(value: number) => void` | Append a single value |
| `setAxesAutoFit` | `(enabled: boolean) => void` | Toggle auto-fit |
| `resetData` | `() => void` | Clear all data |

### Example

```tsx
import { useRef, useEffect } from "react";
import { PlotHistogramImperativeHandle } from "@xframes/common";

const App = () => {
  const histRef = useRef<PlotHistogramImperativeHandle>(null);

  useEffect(() => {
    // Generate normally distributed data
    const values: number[] = [];
    for (let i = 0; i < 500; i++) {
      const u1 = Math.random(), u2 = Math.random();
      const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
      values.push(z * 15 + 50);
    }
    histRef.current?.setData(values);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.PlotHistogram
        ref={histRef}
        axisAutoFit
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

## PlotPieChart

Labeled pie chart with slices.

### Additional props

| Prop | Type | Description |
|------|------|-------------|
| `labelFormat` | `string` | Printf-style format for labels (default `"%.1f"`, `""` to hide) |
| `angle0` | `number` | Starting angle in degrees (default 90) |
| `normalize` | `boolean` | Force values to fill a full circle |

### Imperative handle

```tsx
import { PlotPieChartImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `setData` | `(data: { label: string; value: number }[]) => void` | Set slice data |
| `resetData` | `() => void` | Clear all data |

No `appendData` — pie charts are batch-only.

### Example

```tsx
import { useRef, useEffect } from "react";
import { PlotPieChartImperativeHandle } from "@xframes/common";

const App = () => {
  const pieRef = useRef<PlotPieChartImperativeHandle>(null);

  useEffect(() => {
    pieRef.current?.setData([
      { label: "Desktop", value: 62 },
      { label: "Mobile", value: 28 },
      { label: "Tablet", value: 10 },
    ]);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.PlotPieChart
        ref={pieRef}
        showLegend
        normalize
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

## PlotCandlestick

Financial OHLC candlestick chart.

### Additional props

| Prop | Type | Description |
|------|------|-------------|
| `bullColor` | `string` | CSS color for up candles (e.g. `"#26a69a"`) |
| `bearColor` | `string` | CSS color for down candles (e.g. `"#ef5350"`) |

### Imperative handle

```tsx
import { PlotCandlestickImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `setData` | `(data: { date: number; open: number; close: number; low: number; high: number }[]) => void` | Set candlestick data |
| `setAxesAutoFit` | `(enabled: boolean) => void` | Toggle auto-fit |
| `resetData` | `() => void` | Clear all data |

The `date` field is a Unix timestamp in seconds.

### Example

```tsx
import { useRef, useEffect } from "react";
import { PlotCandlestickImperativeHandle } from "@xframes/common";

const App = () => {
  const candleRef = useRef<PlotCandlestickImperativeHandle>(null);

  useEffect(() => {
    const data = [];
    let price = 150;
    const startDate = new Date("2025-01-01").getTime() / 1000;

    for (let i = 0; i < 90; i++) {
      const date = startDate + i * 86400;
      const open = price;
      const change = (Math.random() - 0.48) * 5;
      const close = open + change;
      const low = Math.min(open, close) - Math.random() * 3;
      const high = Math.max(open, close) + Math.random() * 3;
      data.push({ date, open, close, low, high });
      price = close;
    }

    candleRef.current?.setData(data);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.PlotCandlestick
        ref={candleRef}
        bullColor="#26a69a"
        bearColor="#ef5350"
        axisAutoFit
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

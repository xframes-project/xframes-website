---
sidebar_position: 8
---

# MapView

Interactive slippy map powered by OpenStreetMap raster tiles. Supports smooth panning, scroll-wheel zoom, pin markers, polyline trails, and circle/ellipse overlays. Tiles are fetched on demand and cached in GPU memory with LRU eviction.

:::note
MapView uses an imperative handle for all map operations (positioning, markers, overlays). There are no data props — call `render()` to initialize the map.
:::

## Basic usage

```tsx
import { useRef, useEffect } from "react";
import { MapImperativeHandle } from "@xframes/common";

const MyMap = () => {
    const mapRef = useRef<MapImperativeHandle>(null);

    useEffect(() => {
        // centerX = longitude, centerY = latitude
        mapRef.current?.render(-0.1276, 51.5074, 13); // London, zoom 13
    }, []);

    return (
        <XFrames.MapView
            ref={mapRef}
            style={{ width: "100%", height: 400 }}
        />
    );
};
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `tileUrlTemplate` | `string` | `"https://tile.openstreetmap.org/{z}/{x}/{y}.png"` | URL template with `{z}`, `{x}`, `{y}` tokens |
| `tileRequestHeaders` | `Record<string, string>` | `{ "User-Agent": "xframes/1.0" }` | Custom HTTP headers for tile requests |
| `attribution` | `string` | `"\u00A9 OpenStreetMap contributors"` | Attribution text (bottom-right overlay). Set to `""` to hide |
| `minZoom` | `number` | `1` | Minimum allowed zoom level |
| `maxZoom` | `number` | `17` | Maximum allowed zoom level |
| `cachePath` | `string` | — | Directory for disk tile cache (desktop only, no effect on WASM) |
| `onChange` | `(event) => void` | — | Fires when zoom changes. Payload: `{ value: number }` |
| `onPrefetchProgress` | `(event) => void` | — | Fires during bulk prefetch. Payload: `{ completed: number, total: number }` |

Style variants (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`) are supported for the map container.

## Imperative handle

```tsx
import { MapImperativeHandle } from "@xframes/common";
```

| Method | Signature | Description |
|--------|-----------|-------------|
| `render` | `(centerX: number, centerY: number, zoom: number) => void` | Position the map. `centerX` = longitude, `centerY` = latitude. Must be called at least once |
| `setMarkers` | `(markers: MapMarker[]) => void` | Display pin markers (replaces all existing markers) |
| `clearMarkers` | `() => void` | Remove all markers |
| `setPolylines` | `(polylines: MapPolyline[]) => void` | Display line overlays (replaces all existing polylines) |
| `clearPolylines` | `() => void` | Remove all polylines |
| `appendPolylinePoint` | `(polylineIndex: number, lat: number, lon: number) => void` | Append a point to an existing polyline by index |
| `setOverlays` | `(overlays: MapOverlay[]) => void` | Display circle/ellipse overlays (replaces all existing) |
| `clearOverlays` | `() => void` | Remove all overlays |
| `prefetchTiles` | `(minLon, minLat, maxLon, maxLat, minZoom, maxZoom) => void` | Bulk-download tiles to disk cache (desktop only) |

## Data types

### MapMarker

```ts
type MapMarker = {
    lat: number;
    lon: number;
    color?: string;    // CSS color (e.g. "#FF3333", "rgba(0,128,255,0.5)")
    label?: string;    // Text displayed above the marker
    radius?: number;   // Circle radius in pixels (default: 8)
};
```

### MapPolyline

```ts
type MapPolyline = {
    points: { lat: number; lon: number }[];
    color?: string;        // CSS color (default: blue)
    thickness?: number;    // Line width in pixels (default: 2)
    pointsLimit?: number;  // 0 = unlimited; >0 = FIFO sliding window
};
```

### MapOverlay

```ts
type MapOverlay = {
    lat: number;
    lon: number;
    radiusMeters: number;          // Circle radius or ellipse semi-major axis
    radiusMinorMeters?: number;    // Ellipse semi-minor axis (omit or 0 for circle)
    rotation?: number;             // Ellipse rotation in degrees (default: 0)
    fillColor?: string;            // CSS color (default: semi-transparent blue)
    strokeColor?: string;          // CSS color (default: opaque blue)
    strokeThickness?: number;      // Stroke width in pixels (default: 1.5)
};
```

## Markers

Pin markers are rendered as filled circles with optional text labels.

```tsx
mapRef.current?.setMarkers([
    { lat: 51.5074, lon: -0.1276, color: "#FF3333", label: "London", radius: 10 },
    { lat: 51.5014, lon: -0.1419, color: "#3366FF", label: "Buckingham Palace" },
    { lat: 51.5155, lon: -0.1419, color: "#33CC33", label: "Oxford Circus" },
]);
```

Call `setMarkers([])` or `clearMarkers()` to remove all markers. Each `setMarkers` call replaces the previous set.

## Polylines

Polylines connect a sequence of lat/lon points. Use `pointsLimit` for streaming trails (oldest points are dropped when the limit is reached).

```tsx
// Static route
mapRef.current?.setPolylines([{
    points: [
        { lat: 51.5074, lon: -0.1276 },
        { lat: 51.5014, lon: -0.1419 },
        { lat: 51.5155, lon: -0.1419 },
    ],
    color: "#FF8800",
    thickness: 3,
}]);
```

### Streaming trail

Use `appendPolylinePoint` to build a polyline incrementally (e.g. for a live GPS trail):

```tsx
// Initialize an empty polyline with a 500-point sliding window
mapRef.current?.setPolylines([{
    points: [],
    color: "#FF8800",
    thickness: 3,
    pointsLimit: 500,
}]);

// Append points as they arrive
const interval = setInterval(() => {
    mapRef.current?.appendPolylinePoint(0, newLat, newLon);
}, 100);
```

## Overlays

Circles and ellipses are useful for accuracy regions and geofences. Sizes are specified in meters and scale automatically with zoom.

```tsx
mapRef.current?.setOverlays([
    // Circle (accuracy region)
    {
        lat: 51.5074, lon: -0.1276,
        radiusMeters: 200,
        fillColor: "rgba(0,128,255,0.2)",
        strokeColor: "rgba(0,128,255,0.7)",
    },
    // Ellipse (directional uncertainty)
    {
        lat: 51.5074, lon: -0.1276,
        radiusMeters: 500,
        radiusMinorMeters: 200,
        rotation: 30,
        fillColor: "rgba(255,100,0,0.15)",
        strokeColor: "rgba(255,100,0,0.6)",
    },
]);
```

## Events

### onChange

Fires when the user changes zoom level (via scroll wheel or double-click). Use this to sync external UI controls.

```tsx
const handleMapZoomChange = useCallback((event: MapZoomChangeEvent) => {
    setMapZoom(event.nativeEvent.value);
    zoomSliderRef.current?.setValue(event.nativeEvent.value);
}, []);

<XFrames.MapView onChange={handleMapZoomChange} />
```

### onPrefetchProgress

Fires during a `prefetchTiles` operation with the number of tiles completed and total.

```tsx
const handlePrefetchProgress = useCallback((event: PrefetchProgressEvent) => {
    const { completed, total } = event.nativeEvent;
    progressBarRef.current?.setProgress(completed / total);
}, []);
```

## Tile configuration

### Custom tile server

Replace the default OpenStreetMap tiles with any XYZ tile server:

```tsx
<XFrames.MapView
    tileUrlTemplate="https://my-tile-server.com/tiles/{z}/{x}/{y}.png"
    tileRequestHeaders={{ "Authorization": "Bearer my-api-key" }}
    attribution="My Custom Maps"
/>
```

### Attribution

If you use OpenStreetMap tiles, attribution is required per the [ODbL license](https://osmfoundation.org/wiki/Licence/Attribution_Guidelines). The default attribution text is displayed automatically. Set `attribution=""` only when using a tile source that does not require it.

## Prefetching

:::warning
Bulk tile downloading violates the [usage policy](https://operations.osmfoundation.org/policies/tiles/) of OpenStreetMap's default tile servers. Only use `prefetchTiles()` with a tile server that explicitly permits bulk downloading (e.g. a self-hosted server or a commercial provider).
:::

Prefetch downloads tiles for a bounding box across multiple zoom levels to the disk cache. Desktop only — requires `cachePath` to be set.

```tsx
// Prefetch London area, zoom levels 10–14
mapRef.current?.prefetchTiles(-0.5, 51.3, 0.2, 51.7, 10, 14);
```

The disk cache has no TTL or eviction — tiles persist until manually deleted.

## Mouse interactions

| Action | Behavior |
|--------|----------|
| **Drag** | Pans the map |
| **Scroll wheel** | Zooms in/out centered on cursor |
| **Double-click** | Zooms in one level centered on click point |

All zoom interactions are clamped to `minZoom`–`maxZoom`. When hovering, the cursor's geographic coordinates are displayed in the bottom-left corner.

## Complete example

```tsx
import { useRef, useEffect, useCallback, useState } from "react";
import {
    MapImperativeHandle,
    MapZoomChangeEvent,
    SliderImperativeHandle,
    RWStyleSheet,
} from "@xframes/common";

const styles = RWStyleSheet.create({
    container: {
        flexDirection: "column",
        gap: { row: 8 },
        padding: { all: 8 },
    },
    controls: {
        flexDirection: "row",
        gap: { column: 8 },
        alignItems: "center",
    },
    map: {
        width: "100%",
        height: 500,
    },
});

const MapDemo = () => {
    const mapRef = useRef<MapImperativeHandle>(null);
    const zoomSliderRef = useRef<SliderImperativeHandle>(null);
    const [zoom, setZoom] = useState(13);

    useEffect(() => {
        mapRef.current?.render(-0.1276, 51.5074, 13);
    }, []);

    // Sync zoom slider when user scrolls/double-clicks on map
    const handleMapZoomChange = useCallback((event: MapZoomChangeEvent) => {
        const newZoom = event.nativeEvent.value;
        setZoom(newZoom);
        zoomSliderRef.current?.setValue(newZoom);
    }, []);

    // Re-render map when slider changes
    const handleSliderChange = useCallback((event: any) => {
        const newZoom = Math.round(event.nativeEvent.value);
        setZoom(newZoom);
        mapRef.current?.render(-0.1276, 51.5074, newZoom);
    }, []);

    // Add markers on mount
    useEffect(() => {
        mapRef.current?.setMarkers([
            { lat: 51.5074, lon: -0.1276, color: "#FF3333", label: "London", radius: 10 },
            { lat: 51.5014, lon: -0.1419, color: "#3366FF", label: "Buckingham Palace" },
        ]);
    }, []);

    return (
        <XFrames.Node style={styles.container}>
            <XFrames.Node style={styles.controls}>
                <XFrames.UnformattedText text={`Zoom: ${zoom}`} />
                <XFrames.Slider
                    ref={zoomSliderRef}
                    style={{ width: 200 }}
                    defaultValue={13}
                    min={3}
                    max={17}
                    onChange={handleSliderChange}
                />
            </XFrames.Node>
            <XFrames.MapView
                ref={mapRef}
                style={styles.map}
                minZoom={3}
                maxZoom={17}
                onChange={handleMapZoomChange}
            />
        </XFrames.Node>
    );
};
```

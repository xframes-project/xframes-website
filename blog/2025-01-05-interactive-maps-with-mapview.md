---
slug: interactive-maps-with-mapview
title: "Interactive Maps with MapView"
authors: [andreamancuso]
tags: [maps, widgets]
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Data-heavy desktop applications often need maps — GPS tracking dashboards, IoT fleet monitors, logistics tools, geospatial analysis. In web apps, you'd reach for Leaflet or Mapbox GL. But XFrames doesn't run in a browser DOM, so those libraries aren't an option.

MapView solves this by rendering OpenStreetMap raster tiles directly through ImGui's draw list. Each visible 256x256 tile is fetched, decoded, uploaded to the GPU, and drawn with `ImDrawList::AddImage()`. The same React component works on desktop (OpenGL) and in the browser (WebGPU), with smooth panning, scroll-wheel zoom, and overlay support for markers, polylines, and accuracy circles.

<!-- truncate -->

## How slippy maps work

The [slippy map](https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames) model divides the world into a grid of 256x256 pixel tiles at each zoom level. At zoom 0, the entire world fits in a single tile. Each zoom level doubles the grid in both dimensions: zoom 1 has 4 tiles, zoom 2 has 16, and zoom N has 4^N tiles.

The [Web Mercator projection](https://en.wikipedia.org/wiki/Web_Mercator_projection) converts longitude and latitude into tile coordinates. Given a coordinate pair and zoom level, you can compute exactly which tile contains that point and where within the tile it falls. Each tile is fetched by URL — typically `https://tile.openstreetmap.org/{z}/{x}/{y}.png` — making the entire map a grid of independently cacheable images.

## The tile-grid architecture

On every frame, MapView computes which tiles are visible and renders them:

**1. Visible tile calculation.** The map center is stored as fractional tile coordinates (doubles, not integers), allowing sub-tile precision. From the center, zoom level, and viewport pixel dimensions, the engine computes the integer tile range:

```
xMin = floor(centerTileX - (viewW / 2) / 256)
xMax = ceil(centerTileX + (viewW / 2) / 256)
yMin = floor(centerTileY - (viewH / 2) / 256)
yMax = ceil(centerTileY + (viewH / 2) / 256)
```

**2. Screen positioning.** Each tile's screen position is derived from its offset relative to the center: `px = (tileX - centerTileX) * 256 + viewW / 2`. Tiles partially off-screen are clipped via UV coordinates rather than being skipped entirely, so there are no gaps at viewport edges.

**3. Rendering.** Each tile with a GPU texture gets a single `ImDrawList::AddImage()` call. Missing tiles render as gray placeholder rectangles.

**4. Old-zoom placeholders.** While current-zoom tiles are loading, tiles from the previous zoom level render at 2x or 0.5x scale as visual placeholders. Once all current-zoom tiles arrive, the old-zoom textures are evicted from the GPU cache.

## Three-tier caching

On desktop, MapView uses a three-tier cache to minimize network traffic and texture re-uploads:

- **GPU LRU cache** (max 512 tiles) — uploaded textures ready for immediate rendering. When the cache is full, the least-recently-used tile is evicted via `glDeleteTextures`.
- **Memory cache** (1024 entries, 1-hour TTL) — decoded PNG bytes stored in RAM. Avoids re-decoding when a tile scrolls back into view.
- **Disk cache** (no TTL) — raw PNG files persisted at `cachePath/z/x/y.png`. Survives across application restarts.

The fetch pipeline checks each tier in order: GPU hit (instant render) -> memory hit (re-upload to GPU) -> disk hit (load into memory, upload to GPU) -> network fetch (download, decode, store in all tiers).

Downloads run on a background thread (libcurl on desktop, Fetch API on WASM). Decoded RGBA pixels are pushed to a mutex-protected pending queue, and the render thread uploads them to GPU textures each frame. In-flight tile requests are deduplicated to avoid redundant downloads during rapid panning.

On WASM, the memory and disk tiers are skipped — the browser's HTTP cache serves as the persistence layer, and the GPU LRU cache handles the rest.

## Smooth pan and zoom

**Panning** tracks mouse drag deltas in pixels and converts them to fractional tile coordinate offsets. As the viewport moves, new edge tiles are fetched incrementally — there is no full re-render or re-compositing step. The pan direction is tracked so the engine can prefetch one row or column of tiles ahead of the viewport edge.

**Zooming** via mouse wheel or double-click anchors to the cursor position: the longitude/latitude under the cursor stays fixed while the zoom level changes. A 150ms debounce timer prevents tile fetch storms during rapid scrolling. While new-zoom tiles load, old-zoom tiles continue to render at adjusted scale, providing visual continuity.

## Using MapView in React

MapView follows the same imperative handle pattern as other XFrames widgets with complex state. You declare the component in JSX and control it via a ref:

```tsx
const mapRef = useRef<MapImperativeHandle>(null);

useEffect(() => {
  mapRef.current?.render(-0.1276, 51.5074, 13); // London, zoom 13
}, []);

<XFrames.MapView
  ref={mapRef}
  style={styles.map}
  minZoom={3}
  maxZoom={15}
  cachePath="./tile_cache"
  onChange={handleZoomChange}
/>
```

The `render()` method sets the map center (longitude, latitude) and zoom level. The `onChange` callback fires when the user scrolls to a new zoom level.

**Markers** are filled circles with optional labels, positioned by latitude and longitude:

```tsx
mapRef.current?.setMarkers([
  { lat: 51.5074, lon: -0.1276, color: "#FF0000", label: "London", radius: 8 },
  { lat: 51.5014, lon: -0.1419, color: "#0088FF", label: "Buckingham Palace" },
]);
```

**Polylines** connect sequential coordinates. The `pointsLimit` prop enables FIFO streaming — ideal for live GPS trails where you want a sliding window of the most recent positions:

```tsx
mapRef.current?.setPolylines([{
  points: [],
  color: "#FF8800",
  thickness: 3,
  pointsLimit: 500, // keeps last 500 points
}]);

// As GPS data arrives, append points one at a time
mapRef.current?.appendPolylinePoint(0, newLat, newLon);
```

**Overlays** render circles or ellipses sized in meters, automatically scaled with the zoom level. These are useful for displaying GPS accuracy estimates or geofence boundaries:

```tsx
mapRef.current?.setOverlays([
  {
    lat: 51.5074, lon: -0.1276,
    radiusMeters: 200,
    fillColor: "rgba(0,128,255,0.2)",
    strokeColor: "rgba(0,128,255,0.7)",
  },
]);
```

All imperative handle methods dispatch JSON operations to the C++ backend through the same reactive pipeline used by every other XFrames widget.

## Desktop vs browser

The same `<XFrames.MapView>` component works on both targets. Under the hood, the platform differences are handled in C++:

| | Desktop | WASM |
|---|---|---|
| Tile fetch | libcurl (background thread) | Fetch API (async, main thread) |
| GPU textures | OpenGL (`glTexImage2D`) | WebGPU (`wgpuDeviceCreateTexture`) |
| Tile cache | GPU + memory + disk | GPU LRU + browser HTTP cache |
| Post-render eviction | Yes (`glDeleteTextures`) | Disabled (WebGPU invalidates immediately) |

The WASM target skips post-render GPU eviction because `wgpuTextureViewRelease()` immediately invalidates texture handles that may still be pending in ImGui's draw list — unlike OpenGL, which defers deletion. This is handled transparently; from the React side, the API is identical.

## What's next

You can use any tile server that follows the `{z}/{x}/{y}` URL pattern — pass a custom URL via the `tileUrlTemplate` prop. Self-hosted tile servers, Mapbox, Stadia Maps, and other commercial providers all work.

The streaming polyline and accuracy overlay features make MapView well suited for real-time tracking applications — GPS dashboards, fleet monitoring, IoT device mapping — where positions arrive continuously and the map needs to keep up at 60fps without a browser engine in the way.

See the [MapView documentation](/docs/typescript/components/mapview) for the full API reference.

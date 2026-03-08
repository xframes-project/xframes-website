---
sidebar_position: 4
---

# Display Components

Read-only visual components for showing status, progress, and images. All support four style variants (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`).

## ColorIndicator

Renders a filled colored shape (rectangle or circle). Size is controlled entirely by Yoga layout props (`width`, `height`).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `color` | `string` | CSS color string (e.g. `"#26a69a"`, `"#ff9800"`) |
| `shape` | `"rect" \| "circle"` | Shape to render. Default: `"rect"` |

### Example

```tsx
const styles = RWStyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: { column: 8 }, margin: { bottom: 4 } },
  indicator: { width: 16, height: 16 },
});

const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.Node style={styles.row}>
      <XFrames.ColorIndicator color="#26a69a" shape="circle" style={styles.indicator} />
      <XFrames.UnformattedText text="Connected" />
    </XFrames.Node>
    <XFrames.Node style={styles.row}>
      <XFrames.ColorIndicator color="#ff9800" shape="circle" style={styles.indicator} />
      <XFrames.UnformattedText text="Waiting" />
    </XFrames.Node>
    <XFrames.Node style={styles.row}>
      <XFrames.ColorIndicator color="#ef5350" shape="rect" style={styles.indicator} />
      <XFrames.UnformattedText text="Error" />
    </XFrames.Node>
  </XFrames.Node>
);
```

## ProgressBar

A horizontal progress bar with optional overlay text.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `fraction` | `number` | **Required.** Progress value from 0.0 to 1.0 |
| `overlay` | `string` | Text displayed on top of the bar (e.g. `"75%"`) |

### Example

```tsx
const App = () => (
  <XFrames.Node root style={{ height: "100%" }}>
    <XFrames.ProgressBar fraction={0.75} overlay="75%" />
    <XFrames.ProgressBar fraction={0.42} overlay="Uploading..." />
    <XFrames.ProgressBar fraction={1.0} />
  </XFrames.Node>
);
```

## Image

Displays an image from a file path or URL with optional dimensions.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `url` | `string` | **Required.** Path or URL to the image file |
| `width` | `number` | Image width in pixels |
| `height` | `number` | Image height in pixels |

### Imperative handle

| Method | Description |
|--------|-------------|
| `reload()` | Reload the image from the URL |

### Example

```tsx
import { useRef, useCallback } from "react";
import { ImageImperativeHandle } from "@xframes/common";

const App = () => {
  const imageRef = useRef<ImageImperativeHandle>(null);

  const handleReload = useCallback(() => {
    imageRef.current?.reload();
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Image ref={imageRef} url="./assets/logo.png" width={200} height={150} />
      <XFrames.Button label="Reload image" onClick={handleReload} />
    </XFrames.Node>
  );
};
```

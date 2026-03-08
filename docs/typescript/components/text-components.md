---
sidebar_position: 2
---

# Text Components

Components for displaying text and visual separators. All support four style variants: `style`, `hoverStyle`, `activeStyle`, `disabledStyle`.

## UnformattedText

The basic text display component. The most commonly used text widget.

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | **Required.** The text to display |

```tsx
<XFrames.UnformattedText text="Hello, world" />

<XFrames.UnformattedText
  style={{ font: { name: "roboto-bold", size: 24 } }}
  text="Large heading"
/>
```

## BulletText

Displays text with a bullet point prefix.

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | **Required.** The text to display |

```tsx
<XFrames.BulletText text="First item" />
<XFrames.BulletText text="Second item" />
<XFrames.BulletText text="Third item" />
```

## DisabledText

Displays text in a grayed-out, disabled appearance. Useful for hints, placeholders, or inactive labels.

| Prop | Type | Description |
|------|------|-------------|
| `text` | `string` | **Required.** The text to display |

```tsx
<XFrames.DisabledText text="No data available" />
```

## SeparatorText

A horizontal separator line with a centered text label. Useful for section headers in forms or settings panels.

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | **Required.** The label shown in the separator |

```tsx
<XFrames.SeparatorText label="General" />
<XFrames.Checkbox label="Enable notifications" />
<XFrames.Checkbox label="Dark mode" />

<XFrames.SeparatorText label="Advanced" />
<XFrames.Slider label="Timeout" min={0} max={60} />
```

## Separator

A plain horizontal separator line with no label.

No unique props — style variants only.

```tsx
<XFrames.UnformattedText text="Section one" />
<XFrames.Separator />
<XFrames.UnformattedText text="Section two" />
```

## ClippedMultiLineTextRenderer

A virtualized multi-line text display for streaming or large text content (e.g. log output). Only visible lines are rendered, making it efficient for large amounts of text.

Text is appended programmatically via an imperative handle — there is no `text` prop.

No unique props — style variants only.

### Imperative handle

| Method | Description |
|--------|-------------|
| `appendTextToClippedMultiLineTextRenderer(data: string)` | Append a line of text |

### Example

```tsx
import { useRef, useCallback } from "react";
import { ClippedMultiLineTextRendererImperativeHandle } from "@xframes/common";

const App = () => {
  const logRef = useRef<ClippedMultiLineTextRendererImperativeHandle>(null);

  const addLogLine = useCallback(() => {
    logRef.current?.appendTextToClippedMultiLineTextRenderer(
      `[${new Date().toISOString()}] Event received`
    );
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Button label="Add log entry" onClick={addLogLine} />
      <XFrames.ClippedMultiLineTextRenderer
        ref={logRef}
        style={{ width: "100%", flex: 1 }}
      />
    </XFrames.Node>
  );
};
```

---
sidebar_position: 3
---

# Form Controls

Interactive input components. All support four style variants (`style`, `hoverStyle`, `activeStyle`, `disabledStyle`) and auto-generate their own internal IDs.

Event payloads are accessed via `event.nativeEvent` — for example, `event.nativeEvent.value`.

## Button

A clickable button.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Button text |
| `size` | `{ width: number, height: number }` | Optional fixed dimensions |
| `onClick` | `() => void` | Click callback |

### Example

```tsx
import { useState, useCallback } from "react";

const App = () => {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.UnformattedText text={`Clicked ${count} times`} />
      <XFrames.Button label="Click me" onClick={handleClick} />
    </XFrames.Node>
  );
};
```

## Checkbox

A toggle checkbox with a text label.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `label` | `string` | Label text |
| `defaultChecked` | `boolean` | Initial checked state |
| `onChange` | `(event: CheckboxChangeEvent) => void` | Fires when toggled |

### Event payload

```ts
{ value: boolean }  // true = checked, false = unchecked
```

### Example

```tsx
import { useState, useCallback } from "react";
import { CheckboxChangeEvent } from "@xframes/common";

const App = () => {
  const [enabled, setEnabled] = useState(false);

  const handleChange = useCallback((event: CheckboxChangeEvent) => {
    setEnabled(event.nativeEvent.value);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Checkbox
        label="Enable notifications"
        defaultChecked={false}
        onChange={handleChange}
      />
      <XFrames.UnformattedText text={`Enabled: ${enabled}`} />
    </XFrames.Node>
  );
};
```

## Combo

A dropdown select box.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `options` | `string[]` | List of option labels |
| `placeholder` | `string` | Text shown when no option is selected |
| `initialSelectedIndex` | `number` | Index of the initially selected option |
| `onChange` | `(event: ComboChangeEvent) => void` | Fires when selection changes |

### Event payload

```ts
{ value: number }  // selected option index
```

### Imperative handle

| Method | Description |
|--------|-------------|
| `setSelectedIndex(index: number)` | Programmatically select an option |

### Example

```tsx
import { useRef, useCallback } from "react";
import { ComboChangeEvent, ComboImperativeHandle } from "@xframes/common";

const App = () => {
  const comboRef = useRef<ComboImperativeHandle>(null);

  const handleChange = useCallback((event: ComboChangeEvent) => {
    console.log("Selected index:", event.nativeEvent.value);
  }, []);

  const resetSelection = useCallback(() => {
    comboRef.current?.setSelectedIndex(0);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Combo
        ref={comboRef}
        options={["Small", "Medium", "Large"]}
        initialSelectedIndex={1}
        onChange={handleChange}
      />
      <XFrames.Button label="Reset to Small" onClick={resetSelection} />
    </XFrames.Node>
  );
};
```

## InputText

A text input field with support for multiple input modes.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `defaultValue` | `string` | Initial text content |
| `hint` | `string` | Placeholder text |
| `multiline` | `boolean` | Enable multi-line editing |
| `password` | `boolean` | Mask input with `***` |
| `readOnly` | `boolean` | Prevent user editing |
| `numericOnly` | `boolean` | Allow only decimal digits |
| `onChange` | `(event: InputTextChangeEvent) => void` | Fires on each keystroke |

### Event payload

```ts
{ value: string }  // current text content
```

### Imperative handle

| Method | Description |
|--------|-------------|
| `setValue(value: string)` | Programmatically set the text content |

### Example

```tsx
import { useState, useCallback } from "react";
import { InputTextChangeEvent } from "@xframes/common";

const App = () => {
  const [value, setValue] = useState("");

  const handleChange = useCallback((event: InputTextChangeEvent) => {
    setValue(event.nativeEvent.value);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.InputText hint="Type something..." onChange={handleChange} />
      <XFrames.UnformattedText text={`You typed: ${value}`} />
    </XFrames.Node>
  );
};
```

### Input modes

```tsx
{/* Multi-line text area */}
<XFrames.InputText multiline hint="Enter description..." />

{/* Password field */}
<XFrames.InputText password hint="Password..." />

{/* Read-only display */}
<XFrames.InputText readOnly defaultValue="Cannot edit this" />

{/* Numbers only */}
<XFrames.InputText numericOnly hint="Enter amount..." />
```

## Slider

A horizontal slider for selecting a numeric value within a range.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `defaultValue` | `number` | Initial slider position |
| `min` | `number` | Minimum value |
| `max` | `number` | Maximum value |
| `sliderType` | `"default" \| "angle"` | Slider behavior mode |
| `onChange` | `(event: SliderChangeEvent) => void` | Fires as slider is dragged |

### Event payload

```ts
{ value: number }  // current slider value
```

### Example

```tsx
import { useState, useCallback } from "react";
import { SliderChangeEvent } from "@xframes/common";

const App = () => {
  const [volume, setVolume] = useState(50);

  const handleChange = useCallback((event: SliderChangeEvent) => {
    setVolume(event.nativeEvent.value);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.Slider
        defaultValue={50}
        min={0}
        max={100}
        onChange={handleChange}
      />
      <XFrames.UnformattedText text={`Volume: ${volume}`} />
    </XFrames.Node>
  );
};
```

## MultiSlider

Multiple sliders grouped together for selecting 2, 3, or 4 related values (e.g. RGB colors, XYZ coordinates).

### Props

| Prop | Type | Description |
|------|------|-------------|
| `numValues` | `2 \| 3 \| 4` | **Required.** Number of sliders |
| `defaultValues` | `number[]` | Initial values (length should match `numValues`) |
| `min` | `number` | Minimum value for all sliders |
| `max` | `number` | Maximum value for all sliders |
| `decimalDigits` | `number` | Decimal places for display |
| `onChange` | `(event: MultiSliderChangeEvent) => void` | Fires as any slider is dragged |

### Event payload

```ts
{ values: number[] }  // array of current values
```

### Example

```tsx
import { useCallback } from "react";
import { MultiSliderChangeEvent } from "@xframes/common";

const App = () => {
  const handleChange = useCallback((event: MultiSliderChangeEvent<number>) => {
    const [r, g, b] = event.nativeEvent.values;
    console.log(`RGB: ${r}, ${g}, ${b}`);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.MultiSlider
        numValues={3}
        defaultValues={[128, 128, 128]}
        min={0}
        max={255}
        onChange={handleChange}
      />
    </XFrames.Node>
  );
};
```

## ColorPicker

A color picker using Dear ImGui's `ColorEdit4`. Returns the selected color as a CSS color string.

### Props

| Prop | Type | Description |
|------|------|-------------|
| `defaultColor` | `string` | Initial color as a CSS color string (e.g. `"#26a69a"`) |
| `onChange` | `(event: InputTextChangeEvent) => void` | Fires when color changes |

### Event payload

```ts
{ value: string }  // selected color as CSS color string
```

### Example

```tsx
import { useState, useCallback } from "react";
import { InputTextChangeEvent } from "@xframes/common";

const App = () => {
  const [color, setColor] = useState("#26a69a");

  const handleChange = useCallback((event: InputTextChangeEvent) => {
    setColor(event.nativeEvent.value);
  }, []);

  return (
    <XFrames.Node root style={{ height: "100%" }}>
      <XFrames.ColorPicker defaultColor="#26a69a" onChange={handleChange} />
      <XFrames.UnformattedText text={`Selected: ${color}`} />
    </XFrames.Node>
  );
};
```

---
sidebar_position: 2
---

# Base drawing style properties

These apply to `<XFrames.Node>` only.

```ts
export type RoundCorners = "all" | "topLeft" | "topRight" | "bottomLeft" | "bottomRight";

export type BorderStyle = {
    color: StyleColValue;
    thickness?: number;
};

export type BaseDrawStyle = {
    backgroundColor?: StyleColValue;
    border?: BorderStyle;
    borderTop?: BorderStyle;
    borderRight?: BorderStyle;
    borderBottom?: BorderStyle;
    borderLeft?: BorderStyle;
    rounding?: number;
    roundCorners?: RoundCorners[];
};


More details coming soon

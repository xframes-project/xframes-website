---
title: Frequently Asked Questions
---

Welcome to the xframes FAQ! Here, you'll find answers to common questions about xframes, its features, and how to get started. If you don't find the answer you're looking for, feel free to reach out.

## What is XFrames?

XFrames is an open-source library designed to build GPU-accelerated, native-like desktop applications using Node.js, React, and WebAssembly (WASM). Unlike traditional frameworks like Electron, XFrames enables DOM-free development, leveraging React Native's Fabric renderer to create fast, cross-platform applications. It eliminates the need for a browser runtime, resulting in lightweight and efficient applications. It is built to support both native desktop environments and WebAssembly for seamless cross-platform execution, making it an ideal choice for performance-driven projects.

## What problem does XFrames solve?

XFrames addresses the performance and resource efficiency challenges commonly associated with desktop application frameworks like Electron. While Electron enables rapid development and easy access to the npm ecosystem, it does so at the cost of significant overhead due to bundling a full browser runtime. XFrames offers a lightweight alternative, allowing developers to build cross-platform, GPU-accelerated applications without the need for a web browser. By focusing on native-like performance and eliminating the DOM, XFrames delivers faster, more resource-efficient applications. However, developers must work within the constraints of React Native's Fabric renderer, which means that many existing React packages that depend on the DOM cannot be used. That said, libraries with a headless architecture (such as [React Admin](https://marmelab.com/react-admin/)), could be [integrated into an XFrames application](https://marmelab.com/blog/2024/05/22/using-react-admin-with-react-native.html).

## How come removing the DOM out of the equation makes GUI applications so much faster?

By removing the DOM (Document Object Model), XFrames avoids the overhead associated with HTML, CSS, and JavaScript rendering, which is typically required in web-based frameworks like Electron. The DOM involves a complex process of layout calculation, event handling, and rendering to the screen, all of which consume CPU and memory resources. In contrast, XFrames directly renders graphics using GPU-accelerated technologies like **GLFW** and **OpenGL**, bypassing the need for the browser’s rendering engine. This results in significantly lower latency and higher frame rates, making it ideal for applications that require fast, smooth, and efficient rendering—especially those that need to handle real-time updates or complex graphical content.

---

## Does XFrames depend on React?

Yes, currently, XFrames leverages React to build its UI components. However, it's important to note that **in Node.js applications**, only react is required—react-dom is **not needed**. This makes XFrames more lightweight compared to a full web-based React application. React is used solely for managing UI components and layout rendering, while the GPU-accelerated rendering is handled separately through **GLFW** and **OpenGL**. If you're already familiar with React, this makes XFrames a natural fit for React-based workflows. Future versions may explore alternatives, but React is a core part of XFrames for now.

---

## Why can't I use Material-UI (MUI) in my XFrames application?

The reason you can't use **Material-UI (MUI)** in XFrames, despite React being a dependency, is because **XFrames does not use the DOM**. MUI relies heavily on the DOM for its layout, event handling, and styling, since it is built on top of React DOM and CSS. XFrames, on the other hand, uses **GLFW** and **OpenGL** for rendering, which does not support the typical HTML-based layout and styling systems required by MUI.

---

## What types of fonts are supported in XFrames?

At the moment, **XFrames only supports TTF (TrueType Fonts)**. You can include TTF fonts in your XFrames applications to render text in your custom layouts. Support for other font formats may be added in future releases, but for now, TTF remains the only supported font format.

---

## Can I use XFrames alongside an Electron application?

Yes, **XFrames can be integrated with Electron applications**. This hybrid approach allows you to use XFrames for high-performance, GPU-accelerated tasks while retaining Electron's Chromium-based windows for web-focused functionality. This setup is ideal for incrementally adopting XFrames without requiring a full rewrite.

---

## Can XFrames replace Electron entirely?

XFrames can replace Electron in scenarios where high performance, low resource usage, or GPU-accelerated rendering is required, and web technologies (e.g., DOM, CSS) are unnecessary. However, for applications relying heavily on web-based workflows, such as HTML and CSS for UI, Electron remains a powerful option.

XFrames is a better fit when:

- Performance is critical (e.g., rendering, simulations, real-time GUIs).
- You want smaller application binaries without bundling a browser engine.

---

## What are the benefits of combining XFrames and Electron?

Using XFrames and Electron together allows you to:

- Incrementally migrate high-performance parts of your app to XFrames.
- Optimize GPU-heavy tasks while keeping the flexibility of web technologies for other parts.
- Explore XFrames' potential without abandoning your existing Electron codebase.

---

## Can I distribute a hybrid XFrames-Electron application?

Yes, you can bundle both XFrames and Electron components into a single distribution package. Tools like electron-builder can help manage dependencies and package everything into a standalone executable for end users.

---

## Is XFrames cross-platform like Electron?

Yes, XFrames supports cross-platform development, just like Electron. Both frameworks allow you to build applications for Windows, macOS, and Linux. For best results, ensure that your hybrid application’s XFrames and Electron components are tested on all targeted platforms.

---

## Does XFrames provide a browser-based UI like Electron?

No, XFrames does not use a browser engine or DOM. Instead, it focuses on GPU-accelerated rendering using technologies like GLFW, OpenGL (or WebGPU in a browser environment), and Yoga for layout management. This provides much higher performance but requires a different approach to UI development.

---

## What if I only want XFrames without Electron?

XFrames is fully capable of running standalone. It’s designed to replace Electron in scenarios where the DOM and web standards are unnecessary, providing a leaner, more performant alternative for creating native desktop applications. However, **XFrames currently depends on React** (without `react-dom`) for building UI components, which means that React is required as part of the development process.

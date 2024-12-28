---
title: Technologies used
---

# Technologies used

XFrames leverages a variety of cutting-edge technologies to deliver high-performance, GPU-accelerated, cross-platform applications. Each technology plays a crucial role in ensuring that the library offers seamless integration, native performance, and flexibility for developers. Below is a detailed list of the key tools, frameworks, and libraries that power XFrames, helping developers build fast, modern GUIs without sacrificing performance or cross-platform compatibility.

## The Star of the Show: Dear ImGui

At the heart of XFrames lies [Dear ImGui](https://github.com/ocornut/imgui), a powerful, battle-tested immediate-mode GUI library. It provides developers with unparalleled control and flexibility to design high-performance user interfaces. 
Notably, Dear ImGui supports (among many others) [GLFW](https://www.glfw.org/) + [OpenGL](https://www.opengl.org/) and GLFW + [WebGPU](https://en.wikipedia.org/wiki/WebGPU) rendering out of the box, making it a versatile choice for modern applications.
Combined with supporting technologies like [Implot](https://github.com/epezent/implot) for data visualization, [IconFontCppHeaders](https://github.com/juliettef/IconFontCppHeaders) for iconography, and [Stb's Image Loader](https://github.com/nothings/stb/blob/master/stb_image.h) for image textures, Dear ImGui empowers XFrames to deliver GPU-accelerated GUI experiences.

## Core programming languages

### C++: Core Performance and Flexibility

C++ is the backbone of XFrames, providing low-level performance and the flexibility needed to build fast, high-performance applications. By leveraging C++, XFrames can offer fine-grained control over memory and system resources, essential for rendering GUIs and handling complex tasks like real-time data processing and map rendering.

### C: "lingua franca"

The wrapper library used by other languages such as Go, Rust, Python, and .NET languages (such as C# and F#) has been written in C.
The Java Native Interface library to enable compatibility with JVM languages such as Java, Kotlin and Scala has also been written in C.

## Rendering

### OpenGL: High-Performance Graphics Rendering

By leveraging OpenGL, XFrames ensures high-performance GPU-accelerated rendering, enabling fluid and visually rich user interfaces across platforms. Its integration with GLFW simplifies cross-platform windowing and input handling, making it an essential part of XFrames' rendering stack in Node.js applications.

### GLFW: Cross-Platform Windowing and Input

GLFW facilitates cross-platform window and input management in XFrames. It abstracts platform-specific details, allowing developers to focus on building GUIs while ensuring smooth input handling and windowing functionality across operating systems.

### WebGPU: GPU-Accelerated GUIs in the Browser

With WebGPU, XFrames enables GPU-accelerated GUI rendering directly in the browser, unlocking the power of modern graphics hardware for web applications. This next-gen graphics API allows XFrames to deliver high-performance, dynamic user interfaces in a browser environment, bridging the gap between native and web experiences.

## Main libraries

### Flexbox Without the DOM and CSS: Yoga Layouts

[Yoga](https://www.yogalayout.dev/) provides a Flexbox-based layout system for XFrames, enabling precise and consistent layout management without relying on CSS or the DOM. Developed by Facebook, Yoga is optimized for performance and cross-platform compatibility, making it ideal for native applications.

### ReactivePlusPlus: Efficient Event Handling and UI Updates
 [ReactivePlusPlus](https://github.com/victimsnino/ReactivePlusPlus) helps keeping the rendering layer 'ticking' by queuing widget tree and widget state updates, ensuring that the rendering process remains smooth at 60fps. This ultimately allows XFrames to process complex interactions and UI updates efficiently, maintaining high performance and responsiveness without compromising rendering speed.

### Implot: Powerful Plotting for C++

[Implot](https://github.com/epezent/implot) is a lightweight C++ plotting library designed for high-performance, real-time data visualization. Integrated into XFrames, it enables the easy creation of interactive plots and charts directly within the application. By using Implot, XFrames can provide developers with dynamic, GPU-accelerated plotting capabilities, making it ideal for data-heavy UIs.

### Leptonica: Raster-Based Map Tiles with OpenStreetMap Data

[Leptonica](https://github.com/DanBloomberg/leptonica) is used in XFrames to generate raster-based map tiles from [OpenStreetMap](https://www.openstreetmap.org/about) data, providing efficient map rendering capabilities. Currently, this feature is available in the [WASM version](https://www.npmjs.com/package/@xframes/wasm) of XFrames, allowing developers to integrate map tiles seamlessly into web applications. Soon, it will also be ported to the [Node.js extension](https://www.npmjs.com/package/@xframes/node), enabling native map rendering in desktop applications as well. With Leptonica, XFrames expands its capability to handle complex, tile-based mapping with high performance.

## Other libraries

### nlohmann/json: Seamless Communication Between React and C++
In XFrames, [nlohmann/json](https://github.com/nlohmann/json) facilitates communication between the React/JS layer and the C++ core. By using JSON, the library simplifies data exchange, eliminating the need for pointer management on the JS side. While there is a slight performance overhead from JSON parsing, this is outweighed by the simplicity it offers and the elimination of memory management concerns on the JS side. The result is a more efficient and developer-friendly approach to bridging the gap between high-level React interactions and low-level C++ logic.

### ada-url: Simplified URL Parsing and Handling
[ada-url](https://github.com/ada-url/ada) is a lightweight C++ library for URL parsing and manipulation. It offers an intuitive API for handling complex URL operations, making it easier to work with URLs in XFrames. By integrating ada-url, the framework ensures efficient and reliable URL processing across different platforms.

### fmt: Modern, Fast C++ Formatting
[fmt](https://github.com/fmtlib/fmt) is a modern C++ library that simplifies string formatting. It provides a safer, more efficient alternative to traditional printf-style formatting, with features like type safety and a clean, user-friendly API. By utilizing fmt, XFrames achieves fast, readable, and maintainable code for formatting tasks.

### googletest: Unit Testing for C++

[googletest](https://github.com/google/googletest) is a C++ testing framework integrated into XFrames to help ensure the reliability of its C++ components. While there are unit tests in place, coverage is still a work in progress. As XFrames continues to grow, increasing test coverage and refining test suites will be a priority to ensure stability and catch regressions early.

## Tooling

### vcpkg: Simplified Dependency Management

[vcpkg](https://github.com/microsoft/vcpkg) is a cross-platform package manager for C++ that streamlines the process of managing libraries and dependencies. Integrated into XFrames, it simplifies the installation and maintenance of external libraries, ensuring that dependencies are handled consistently across platforms. By leveraging vcpkg, XFrames developers can focus on building functionality rather than wrestling with dependency configurations.

### CMake: Cross-Platform Build Automation

[CMake](https://cmake.org/) is a powerful cross-platform build system that automates the build process for XFrames. It enables consistent builds across various operating systems by generating native makefiles, project files, or IDE configurations. With CMake, developers can easily configure, build, and manage the XFrames codebase, ensuring smooth cross-platform development and deployment.

### cmake-js: Building Native Node.js Addons

[cmake-js](https://github.com/cmake-js/cmake-js) is a tool that simplifies the process of building native Node.js addons using CMake. It bridges the gap between the Node.js and C++ worlds, allowing XFrames to compile and link C++ code seamlessly into Node.js modules. By using cmake-js, XFrames can take advantage of CMake’s powerful build system while maintaining compatibility with the Node.js ecosystem, making it easier to develop native extensions for cross-platform desktop applications.

### prebuild & prebuild-install: Streamlined Setup for Developers

[prebuild](https://github.com/prebuild/prebuild) and [prebuild-install](https://github.com/prebuild/prebuild-install) simplify the setup process for XFrames by providing pre-built binaries, allowing developers to start building their applications without needing to compile the library themselves. `prebuild` ensures the binaries are available, while `prebuild-install` automatically fetches them during installation. This eliminates the need for complex build setups, enabling developers to quickly integrate XFrames into their projects and focus on development rather than dealing with dependencies or build configurations.

## Programming language bindings 

### Node.js and browser support through WebAssembly

Find out more about [XFrames for Node.js](https://github.com/xframes-project/xframes/tree/main/packages/dear-imgui/npm/node#readme).

Find out more about [XFrames for WebAssembly](https://github.com/xframes-project/xframes/tree/main/packages/dear-imgui/npm/wasm#readme).

#### TypeScript: Strong Typing and Developer Productivity

XFrames NPM modules are written in TypeScript to provide strong typing out of the box. TypeScript enhances developer productivity by catching errors at compile time and providing rich IDE support. By using TypeScript, XFrames ensures that its JavaScript layer is more maintainable, scalable, and robust while still enjoying the flexibility and dynamics of JavaScript.

#### React: A Declarative UI Foundation

[React](https://react.dev/) powers the UI layer in XFrames, offering a familiar component-based approach without relying on the DOM. Instead, XFrames uses React with [Fabric](https://reactnative.dev/architecture/fabric-renderer), React Native’s rendering layer, to manage UI components in a DOM-free environment. This enables developers to maintain React's declarative style while rendering directly to GPU-accelerated contexts such as OpenGL and WebGPU. By breaking free of browser constraints, XFrames allows developers to build dynamic, high-performance native applications with React at its core.

#### Fabric: Efficient React Tree Management

[Fabric](https://reactnative.dev/architecture/fabric-renderer) is utilized in XFrames to efficiently manage the React tree by tracking changes to elements, attributes, and children. It emits events that XFrames forwards to the C++ layer, which updates the widget tree and handles rendering. This approach allows XFrames to benefit from the efficient tree management of Fabric without requiring the full React Native ecosystem or its associated overhead.

#### RxJS: Efficient Event Handling

[RxJS](https://rxjs.dev/) is used in XFrames to manage user interactions, such as clicks, changes, and hover events, asynchronously from the C++ layer. This allows efficient handling of event streams and ensures responsiveness.

### Python

Find out more about [XFrames for Python](https://github.com/xframes-project/xframes-python).

#### Pybind11

Pybind11 is a lightweight header-only library that simplifies creating Python bindings for C++ code. It offers a seamless interface between C++ and Python, allowing native C++ code to be called from Python.

#### Scikit-build-core 

Scikit-build-core is a build system that integrates with CMake, providing a more Pythonic interface for building C++ extensions. It simplifies packaging and distributing Python C++ extensions, making it easier to build cross-platform bindings.

### F#

Find out more about [XFrames for F#](https://github.com/xframes-project/xframes-fsharp).

#### Reactive Extensions

Reactive Extensions (Rx) in F# provide a declarative approach to handling asynchronous and event-based programming through observables. This enables efficient tracking of prop and children changes, ensuring dynamic UI updates in response to state changes. By integrating Rx into XFrames, a clean, reactive flow is maintained, enhancing scalability and responsiveness while simplifying state management.

### Kotlin

#### Jetpack Compose Runtime

The Compose Runtime is a key component of Jetpack Compose, enabling a reactive, declarative UI framework for Kotlin. It manages UI state and recomposition efficiently, allowing for responsive and dynamic UI updates. In the context of XFrames, integrating the Compose Runtime with Kotlin ensures that the UI reacts seamlessly to changes in state and structure, maintaining a clean, efficient flow while simplifying the development of modern, scalable applications. 

### Ada

Find out more about [XFrames for Ada](https://github.com/xframes-project/xframes-ada).

#### GNATcoll

[GNATcoll](https://github.com/AdaCore/gnatcoll-core) is a set of open-source Ada libraries providing a wide range of utilities and functionality. XFrames currently uses only the [JSON](https://docs.adacore.com/live/wave/gnatcoll-core/html/gnatcoll-core_ug/json.html) module for handling JSON data.

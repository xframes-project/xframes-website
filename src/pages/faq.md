---
title: Frequently Asked Questions
---

Welcome to the XFrames FAQ! Here, you'll find answers to common questions about XFrames, its features, and how to get started. If you don't find the answer you're looking for, feel free to reach out.

## What is XFrames?

XFrames is an open-source library designed to build GPU-accelerated, native-like desktop applications using a variety of programming languages, including JavaScript (Node.js), Kotlin, and F#. Unlike traditional frameworks like Electron, XFrames enables DOM-free development offering fast, cross-platform performance. Over 20 programming languages are supported on the desktop, thanks to custom JNI and C libraries. The WASM version requires JavaScript and currently React as well. XFrames is ideal for performance-driven projects, supporting both native desktop environments and cross-platform execution.

---

## What problem does XFrames solve?

XFrames addresses the performance and resource efficiency challenges commonly associated with desktop application frameworks like Electron. While Electron enables rapid development and easy access to the npm ecosystem, it does so at the cost of significant overhead due to bundling a full browser runtime. XFrames offers a lightweight alternative, allowing developers to build cross-platform, GPU-accelerated applications without the need for a web browser. By focusing on native-like performance and eliminating the DOM, XFrames delivers faster, more resource-efficient applications.

---

## How come removing the DOM out of the equation makes GUI applications so much faster?

By removing the DOM (Document Object Model), XFrames avoids the overhead associated with HTML, CSS, and JavaScript rendering, which is typically required in web-based frameworks like Electron. The DOM involves a complex process of layout calculation, event handling, and rendering to the screen, all of which consume CPU and memory resources. In contrast, XFrames directly renders graphics using GPU-accelerated technologies like **GLFW** and **OpenGL**, bypassing the need for the browser’s rendering engine. This results in significantly lower latency and higher frame rates, making it ideal for applications that require fast, smooth, and efficient rendering—especially those that need to handle real-time updates or complex graphical content.

---

## Can you list a few disadvantages?

The verbosity of the code can vary depending on the programming language you choose. Languages with domain-specific language (DSL) support, such as Kotlin and F#, provide a more streamlined and developer-friendly experience.

Since XFrames doesn't rely on the DOM, developers are unable to take advantage of the vast ecosystem of JavaScript libraries.

Additionally, debugging tools for rendering are currently still limited, making it more challenging to troubleshoot and optimize certain aspects of the application.

---

## Why can't I use Material-UI (MUI) in my XFrames application?

The reason you can't use **Material-UI (MUI)** in XFrames, despite React being a dependency, is because **XFrames does not use the DOM**. MUI relies heavily on the DOM for its layout, event handling, and styling, since it is built on top of React DOM and CSS. XFrames, on the other hand, uses **GLFW** and **OpenGL** for rendering, which does not support the typical HTML-based layout and styling systems required by MUI.

---

## What types of fonts are supported in XFrames?

At the moment, **XFrames only supports TTF (TrueType Fonts)**. You can include TTF fonts in your XFrames applications to render text in your custom layouts. Support for other font formats may be added in future releases, but for now, TTF remains the only supported font format.

---

## I am an Electron user and I cannot afford to do a full switch - can I use XFrames alongside an Electron application?

Yes, **XFrames can be integrated with Electron applications**. This hybrid approach allows you to use XFrames for high-performance, GPU-accelerated tasks while retaining Electron's Chromium-based windows for web-focused functionality. This setup is ideal for incrementally adopting XFrames without requiring a full rewrite.

---

## Can XFrames replace Electron entirely?

XFrames can replace Electron in scenarios where high performance, low resource usage, or GPU-accelerated rendering is required, and web technologies (e.g., DOM, CSS) are unnecessary. However, for applications relying heavily on web-based workflows, such as HTML and CSS for UI, Electron remains a powerful option.

XFrames is a better fit when any of the following applies:

- For whatever reason JavaScript (or any other language that compiles to JavaScript) cannot be used
- Performance is critical (e.g., rendering, simulations, real-time GUIs).
- You want smaller application binaries without bundling a browser engine.

---

## Is XFrames truly cross-platform?

Yes, XFrames supports cross-platform development - we have tested it across various operating systems and platforms. It allows you to build applications for Windows, macOS, and Linux across various architectures. However, the platforms supported may vary depending on the programming language you choose to work with.

---

## How can different programming languages work with XFrames?

XFrames provides support for [Foreign Function Interfaces](https://en.m.wikipedia.org/wiki/Foreign_function_interface) to enable seamless integration with various programming languages. We've focused on making it as straightforward as possible for developers to interoperate with XFrames, whether using C#, Java, Ada, or other languages with FFI capabilities. We're continually seeking feedback to enhance the developer experience, so please reach out with suggestions or issues you encounter.

Would you like any revisions or additions? 

---

## Can I distribute XFrames applications as standalone applications?

The short answer is yes! This is especially true if you are using compiled languages, because you would just need to include the executable and the library files (.dll, .so or .dynlab).
For interpreted languages you may need to also distribute the interpreter, or embed your application into it (this is the case with Node.js and Python).
That said, it is best to refer to the docs and/or README file for the corresponding programming language you intend to use. Go ahead and file an issue in the corresponding repo if details are missing.

## How large are the standalone applications?

The size of the distributable package (the executable, its dependencies, and assets) can vary wildly:

- 50 MB+ for Node.js (using [Nexe](https://github.com/nexe/nexe) and embedding the native npm module);
- 25-30 MB for .NET languages (this includes all the .NET dependencies and the XFrames DLL);
- 40 MB for Kotlin (using Gradle's distZip, includes Compose Runtime and the JNI library);
- 20-25 MB for Python (using [Briefcase](https://github.com/beeware/briefcase) or [PyInstaller](https://pyinstaller.org/en/stable/) and embedding the native Python module)
- 10-15 MB for compiled languages such as Nim, OCaml, Racket, Haskell, Ada, Crystal, D.

Please note, this list is not comprehensive, we've yet to try out Go, Rust, Swift - among others.

In comparison, Electron applications often exceed 100MB once you factor in Node.js, Chromium and various assets.

You should use the release version of the JNI or C wrapper libraries as they are substantially smaller.

## What about signing my application?

On Windows, you can sign your EXE files using a Code Signing Certificate, typically obtained from a trusted Certificate Authority (CA) like DigiCert or Sectigo. Once you have the certificate, you can use tools like SignTool (available with the Windows SDK) to sign your EXE files, which helps to verify the publisher and assures users that the file has not been tampered with.

On Linux, signing is commonly done using tools like GPG (GNU Privacy Guard) to generate and apply a signature to your binaries. Many Linux distributions also support AppImage signing, allowing you to sign packaged applications for distribution.

On macOS, code signing is mandatory for applications that are distributed outside the App Store. You can sign your application using Apple's codesign utility and an appropriate Apple Developer certificate. This ensures that your app is recognized as trusted by macOS, which is important for smooth installation and execution, particularly for apps distributed via the internet. Additionally, on macOS, you may also need to notarize your application with Apple to prevent warnings during installation.

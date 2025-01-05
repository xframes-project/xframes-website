---
slug: the-wonders-of-ffi-using-xframes-across-19-different-languages
title: "The Wonders of FFI: Using XFrames Across 19 Different Languages"
authors: [andreamancuso]
tags: [ffi]
---

Discover the power of [Foreign Function Interface (FFI)](https://en.wikipedia.org/wiki/Foreign_function_interface) and how it unlocks the potential to use XFrames, a high-performance, GPU-accelerated GUI library, in 19 different languages. Whether you're a Python developer, a Java enthusiast, or a fan of lesser-known languages like Crystal or Nim, this post will show you how FFI enables seamless cross-language functionality. I'll share the challenges, solutions, and key lessons I learned while making XFrames work across this diverse ecosystem of programming languages.  

<!-- truncate -->

## Why FFI is a game-changer for XFrames

By utilizing FFI, XFrames can interact seamlessly with a wide array of languages, including Ruby, Ada, Fortran, Haskell, and more. For JVM-based languages, such as Java, Kotlin, Scala, JNI provides a similar integration, while native modules for Node.js and Python ensure smooth functionality in those ecosystems. This interoperability allows developers to integrate high-performance, GPU-accelerated GUI features into their applications, regardless of the programming language they use, without needing to rewrite code for each one. While the overhead of FFI can vary, the core performance of XFrames—particularly in its C++/OpenGL layer—remains intact, with any potential overhead specific to the FFI layer itself.

While FFI enables flexibility, it's currently best suited for desktop applications, with future enhancements to expand its versatility across more languages and use cases.

## A note on WebAssembly

I am aware that some of the languages mentioned below support WebAssembly. Whilst still somewhat rough around the edges, [emscripten](https://emscripten.org/) has improved substantially in terms of stability and performance. That said, I am also aware that many developers these days have the option to use their favourite language to build browser-based applications. Notable examples include [Fable](https://fable.io/), [Scala.js](https://www.scala-js.org/), [Nim's JavaScript backend](https://nim-lang.org/docs/backends.html#backends-the-javascript-target).

Here goes the question: wouldn't it be nice to be able to also target WebAssembly using such solutions? Should developers using XFrames have the ability to target both the desktop and the browser? What I can say at this point is: let's improve the developer experience as far as targeting the desktop is concerned and I'll get back to you on this topic.

## The 19 Languages Supported by XFrames

### Native modules

I admit that, up until a couple of months ago, I had never got my hands dirty with FFI - I just knew of its benefits on paper. Hence I initially started investing time and effort into writing native modules for the programming language I am most proficient with: JavaScript (and TypeScript).

#### Node.js

When I started working on XFrames I originally targeted WebAssembly only. Eventually I realized that with a little of conditional compilation in the C++ source code I could also target native npm modules using [N-API](https://nodejs.org/api/n-api.html). I naturally had to drop WebGPU and decided to use OpenGL 3. To make the build process more intuitive and flexible, I chose the [cmake-js toolchain](https://github.com/cmake-js/cmake-js) over [node-gyp](https://github.com/nodejs/node-gyp), as (at least in my opiniong) it offers a more streamlined and customizable approach to building native modules. This integration allows Node.js developers to easily access XFrames' GPU-accelerated UI features without needing to interact with C++ directly, while maintaining high performance and efficient memory management.

#### Python

For Python, I used [Pybind11](https://github.com/pybind/pybind11) to create native bindings that enable seamless integration between XFrames and Python. This allows Python developers to directly access XFrames’ powerful GPU-accelerated UI features without needing to deal with the complexities of C++. The module is designed to be easy to use, ensuring smooth integration and efficient memory management.

### FFI support

FFI sounds great on paper (taken from Wikipedia): "A foreign function interface is a mechanism by which a program written in one programming language can call routines or make use of services written or compiled in another one". So far so good, right? So why isn't everyone taking advantage of this amazing, almost magical, mechanism?

If you have used JSON (or XML) API HTTP-based endpoints (or even gRPC), you already know that the interoperability overhead between the client and the server is handled through marshalling and unmarshalling of input and (where applicable) output. When it comes to two different programming languages, the interoperability between two different ways of handling memory, data types and routines can be quite challenging. One such challenge is of course the bridging of a programming language that supports garbage collection with one that doesn't. And of course some complex data structures may be impossible to replicate in another language.

If you are wondering: "If it is so difficult, how did you do it?", here's the short answer: by going [KISS](https://en.wikipedia.org/wiki/KISS_principle) of course. As I mentioned above, I originally targeted WebAssembly and, to avoid juggling pointers and whatnot between JS and C++, I thought I would send JSON-serialized data to the C++ (and vice versa). Whilst the marshalling and unmarshalling does have a performance cost, it does mean we don't need to do any mapping of complex data types. Moreover, it refrains us from directly manipulating the inner state of objects and other data structures - rather we can do so by invoking functions. What this also means is that the public interface is compact and straightforward.

All that being said, unfortunately C++ and FFI do not always get on well, notably due to [name mangling](https://en.wikipedia.org/wiki/Name_mangling).
Wheher we like it or not, C is still the lingua franca of programming: almost every single respectable programming language has FFI support for C libraries. This prompted me to write a thin C wrapper library to make it as straightforward as possible to interact with XFrames.

#### .NET (so far C# and F#)

```csharp
type OnInitCb = unit -> unit
type OnTextChangedCb = delegate of int * string -> unit
type OnComboChangedCb = int * int -> unit
type OnNumericValueChangedCb = int * float -> unit
type OnBooleanValueChangedCb = int * bool -> unit
type OnMultipleNumericValuesChangedCb = int * float[] -> unit
type OnClickCb = delegate of int -> unit

[<DllImport("xframesshared.dll", CallingConvention = CallingConvention.Cdecl)>]
extern void init(
    string assetsBasePath,
    string rawFontDefinitions,
    string rawStyleOverrideDefinitions,
    IntPtr onInit,
    IntPtr onTextChanged,
    IntPtr onComboChanged,
    IntPtr onNumericValueChanged,
    IntPtr onBooleanValueChanged,
    IntPtr onMultipleNumericValuesChanged,
    IntPtr onClick
)
```

#### Ada

#### Lua

#### OCaml

#### Racket

#### Fortran

#### Delphi

#### (Free) Pascal

#### Nim

#### Ruby

#### Crystal

#### D

#### Haskell

### JNI support

#### Java

#### Kotlin

#### Scala

#### **Challenges and Solutions**
- Discuss some of the roadblocks you encountered with FFI/JNI and how you overcame them. You can break it down by language or toolset.

#### **The Bigger Picture: Cross-Language Collaboration**
- Explain how FFI helps developers work with their language of choice while leveraging powerful tools like XFrames.
- Reflect on how this fits into modern polyglot development.

#### **Future Directions and Improvements**
- Discuss upcoming plans for additional language support or enhancements to the integration process.

#### **Conclusion**
- Sum up the benefits of FFI and how it empowers developers to use XFrames across multiple languages.
- Encourage readers to experiment with FFI in their own projects and provide feedback or contribute to the ecosystem.


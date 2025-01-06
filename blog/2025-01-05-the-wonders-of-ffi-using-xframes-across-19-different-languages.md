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

### A note on WebAssembly

I am aware that some of the languages mentioned below support WebAssembly. Whilst still somewhat rough around the edges, [emscripten](https://emscripten.org/) has improved substantially in terms of stability and performance. That said, I am also aware that many developers these days have the option to use their favourite language to build browser-based applications. Notable examples include [Fable](https://fable.io/), [Scala.js](https://www.scala-js.org/), [Nim's JavaScript backend](https://nim-lang.org/docs/backends.html#backends-the-javascript-target).

Here goes the question: wouldn't it be nice to be able to also target WebAssembly using such solutions? Should developers using XFrames have the ability to target both the desktop and the browser? What I can say at this point is: let's improve the developer experience as far as targeting the desktop is concerned and I'll get back to you on this topic.

### A non-comprehensive primer on C data types, pointers, functions.

If you already know C you can skip this section. If you do not know C then you likely would need to go even deeper than this, though hopefully the following shall suffice for now.

#### Integers

In C, the default `int` type is signed and typically 4 bytes (32 bits) on most platforms.

#### Floats

In C, **floats** are used to represent real numbers with decimal points (i.e., non-integer numbers). They allow you to store and manipulate numbers that require fractional precision. A float typically requires **4 bytes** (32 bits) of memory and provides about **6-7 decimal digits of precision**.

You can perform standard arithmetic operations with float values. However, floating-point arithmetic is not exact due to limited precision. This happens because many decimal fractions cannot be precisely represented in binary form, leading to small rounding errors.

#### Booleans

In C, there is no native bool type like in some other programming languages (such as Python, Java, or C++). However, C provides a way to simulate boolean behavior using integers, specifically with 0 representing false and non-zero values (typically 1) representing true. Starting with C99, C introduced a standard header file called `<stdbool.h>` that defines a bool type and the true and false constants. This makes it easier to work with booleans in a way that is more intuitive and readable.

#### Arrays

The one thing to know about arrays in C is that passing an array in C typically entails passing a pointer to the array itself plus an integer indicating the size (number of items) within it. To access individual values of an array, one can use **pointer dereferencing** combined with pointer arithmetic.

Unfortunately, in C it's very possible to accidentally access **undefined elements** of an array in C, which can lead to **undefined behavior**. Array bounds are not checked at runtime, so if you access elements beyond the valid range, the program won’t generate an error immediately—it may produce garbage values, crash, or exhibit unexpected behavior.

#### Strings

**Strings** are represented as arrays of characters, with they key distinction that they are **null-terminated**. This means a C string is a sequence of characters followed by a special character '\0' (null character), which indicates the end of the string.

When you want to pass a string without modifying it, you normally use `const char*` as the parameter type. This ensures the function doesn’t accidentally modify the string. If you want the function to modify the string, simply use `char*` as the parameter type.

#### Functions

A function has a return type, name, optional parameters, and a body. Functions can return a value or be of type void (if they don’t return anything). Parameters are placeholders for values passed when calling the function, known as arguments. Local variables exist only within the function they are defined in. Functions can be recursive, calling themselves to solve problems in smaller steps.

#### Type aliasing

In C, `typedef` is a keyword used to define aliases for existing types. It allows to create a new name (a type alias) for a type, making the code easier to read, more maintainable, and often more expressive. `typedef` can be used to alias primitive types, pointers, structs, function pointers.

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

All that being said, unfortunately C++ and FFI do not always get on well, notably due to the notoriously aggressive [name mangling](https://en.wikipedia.org/wiki/Name_mangling).
Wheher we like it or not, C is still the lingua franca of programming: almost every single respectable programming language has FFI support for C libraries. This prompted me to write a thin C wrapper library to make it as straightforward as possible to interact with XFrames.

#### C library interface

The following assumes that you are familiar with the basic C concepts described above.

lt's have a look at the first 'foreign' C function:

```c showLineNumbers
#ifdef _WIN32
#define EXPORT_API __declspec(dllexport)  // Import symbols from DLL
#else
#define EXPORT_API __attribute__((visibility("default")))  // For non-Windows
#endif

EXPORT_API typedef void (*OnInitCb)();
EXPORT_API typedef void (*OnTextChangedCb)(int, const char*);
EXPORT_API typedef void (*OnComboChangedCb)(int, int);
EXPORT_API typedef void (*OnNumericValueChangedCb)(int, float);
EXPORT_API typedef void (*OnBooleanValueChangedCb)(int, bool);
EXPORT_API typedef void (*OnMultipleNumericValuesChangedCb)(int, float*, int numValues);
EXPORT_API typedef void (*OnClickCb)(int);

EXPORT_API void init(
    const char* assetsBasePath,
    const char* rawFontDefinitions,
    const char* rawStyleOverrideDefinitions,
    OnInitCb onInit,
    OnTextChangedCb onTextChanged,
    OnComboChangedCb onComboChanged,
    OnNumericValueChangedCb onNumericValueChanged,
    OnBooleanValueChangedCb onBooleanValueChanged,
    OnMultipleNumericValuesChangedCb onMultipleNumericValuesChanged,
    OnClickCb onClick
);

EXPORT_API void setElement(const char* elementJson);
EXPORT_API void setChildren(int id, const char* childrenIds);
```

A brief description of each parameter:

| Parameter                      | Type                           | Description                                                                                                                                                                                         |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assetsBasePath                 | null-terminated string pointer | tells the engine where to find font files and other assets (images, etc.)                                                                                                                           |
| rawFontDefinitions             | null-terminated string pointer | JSON-encoded structure containing font definition pairs (font name + size)                                                                                                                          |
| rawStyleOverrideDefinitions    | null-terminated string pointer | JSON-encoded structure containing theming properties                                                                                                                                                |
| onInit                         | function pointer               | invoked as soon as the engine has been initialized and is ready to receive messages                                                                                                                 |
| onTextChanged                  | function pointer               | invoked whenever the value of a text widget changes (`int` identifies the widget ID, `const char*` is the current value)                                                                            |
| onComboChanged                 | function pointer               | invoked whenever the selected index of a numeric widget changes (`int` identifies the widget ID, `float` is the current value)                                                                      |
| onBooleanValueChanged          | function pointer               | invoked whenever the state of a checkbox widget changes (`int` identifies the widget ID, bool` indicates the checked/unchecked state)                                                               |
| onMultipleNumericValuesChanged | function pointer               | invoked whenever any of the values of a multi-value widget changes (the first `int` identifies the widget ID, `float*` points at the float array, the second `int` indicates the size of the array) |
| onClick                        | function pointer               | invoked whenever the 'clicked' event for a widget is triggered (`int` identifies the widget ID)                                                                                                     |

Also very important is the **preprocessor conditional statement** used to define the `EXPORT_API` **macro** for _symbol visibility_, specifically for controlling how functions or variables are exported from shared libraries (DLLs on Windows or shared objects on other platforms like Linux or macOS). Exporting symbols ensures that functions or variables in a shared library can be used by other programs. In Windows, this is done with `__declspec(dllexport)`, while in Linux and other Unix-like systems, it is done with `__attribute__((visibility("default")))`.

On Windows you can run `dumpbin /exports xframesshared.dll`:

```powershell
        # [...]
        376  177 00010FA5 appendChild
        377  178 00011B26 appendTextToClippedMultiLineTextRenderer
        378  179 00006EBF elementInternalOp
        379  17A 00012C51 getChildren
        380  17B 000119EB getStyle
        381  17C 00004917 init # Here's the init() function
        382  17D 0000EA9D patchElement
        383  17E 00008F3F patchStyle
        384  17F 0000F411 resizeWindow
        385  180 00003F5D setChildren
        386  181 000118F6 setDebug
        387  182 00002699 setElement
        388  183 0000B9E7 showDebugWindow

  Summary

        1000 .00cfg
       15000 .data
        4000 .idata
       3F000 .pdata
      169000 .rdata
        A000 .reloc
        1000 .rsrc
      4FD000 .text
        1000 .tls
```

On Linux you can run `nm -D libxframesshared.so`:

```bash
# [...]
0000000000447a70 T init
00000000004475b0 T patchElement
0000000000447940 T patchStyle
0000000000447370 T resizeWindow
0000000000448cf0 T setChildren
0000000000447440 T setDebug
0000000000447480 T setElement
0000000000447460 T showDebugWindow
# [...]
```

#### .NET (so far C# and F#)

```csharp
type OnInitCb = unit -> unit
type OnTextChangedCb = delegate of int * string -> unit
type OnComboChangedCb = delegate of int * int -> unit
type OnNumericValueChangedCb = delegate of int * float -> unit
type OnBooleanValueChangedCb = delegate of int * bool -> unit
type OnMultipleNumericValuesChangedCb = delegate of int * float[] -> unit
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

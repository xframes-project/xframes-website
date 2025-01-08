---
slug: using-xframes-across-different-languages-through-ffi
title: "Using XFrames across different Languages through FFI"
authors: [andreamancuso]
tags: [ffi]
toc_min_heading_level: 2
toc_max_heading_level: 5
---

Imagine being able to use a powerful C++ GUI library in over a dozen different programming languages without rewriting a single line of code. This is possible thanks to the [Foreign Function Interface (FFI)](https://en.wikipedia.org/wiki/Foreign_function_interface) — a bridge that allows programs written in one language to call functions written in another. In this post, I'll walk you through how I leveraged FFI to make XFrames, a high-performance, GPU-accelerated GUI library, work seamlessly across a diverse ecosystem of languages.

We'll explore how FFI can unlock cross-language functionality, discuss the specific challenges I encountered, and share key lessons learned. Whether you're a developer curious about cross-language interoperability or someone tackling real-world FFI issues, this guide has something for you.

<!-- truncate -->

## The benefits of FFI

By utilizing FFI, XFrames can interact seamlessly with a wide array of languages, including Ruby, Ada, Fortran, Haskell, Crystal, and more.
This interoperability allows developers to integrate high-performance, GPU-accelerated GUI features into their applications, regardless of the programming language they use, without needing to rewrite code for each one. While the overhead of FFI can vary, the core performance of XFrames—particularly in its C++/OpenGL layer—remains intact, with any potential overhead specific to the FFI layer itself.

While FFI enables flexibility, it's currently best suited for desktop applications, with future enhancements to expand its versatility across more languages and use cases.

**Key takeaway**: FFI provides a powerful way to integrate C++ libraries like XFrames into many languages, avoiding duplication of effort. However, developers need to be mindful of the potential performance overhead and current limitations when using it for real-time applications.

## The challenges of FFI

FFI sounds great on paper (taken from Wikipedia): "A foreign function interface is a mechanism by which a program written in one programming language can call routines or make use of services written or compiled in another one". So far so good, right? So why isn't everyone taking advantage of this amazing, almost magical, mechanism?

If you have used JSON (or XML) API HTTP-based endpoints (or even gRPC), you already know that the interoperability overhead between the client and the server is handled through marshalling and unmarshalling of input and (where applicable) output. When it comes to two different programming languages, the interoperability between two different ways of handling memory, data types and routines can be quite challenging.

One such challenge is, of course, the bridging of a programming language that supports garbage collection with one that doesn't. And of course, some complex data structures may be impossible to replicate in another language.

**Key takeaway**: FFI isn’t magic—it comes with significant challenges, such as handling memory across languages with different models and dealing with complex data structures that don’t translate well. Understanding these challenges is essential before adopting FFI for large-scale projects.

---

#### A note on WebAssembly

I am aware that some of the languages mentioned below support WebAssembly. Whilst still somewhat rough around the edges, [emscripten](https://emscripten.org/) has improved substantially in terms of stability and performance. That said, I am also aware that many developers these days have the option to use their favourite language to build browser-based applications. Notable examples include [Fable](https://fable.io/), [Scala.js](https://www.scala-js.org/), [Nim's JavaScript backend](https://nim-lang.org/docs/backends.html#backends-the-javascript-target).

I will cover WebAssembly in a separate post.

---

#### A note on Node.js and Python

I created native modules for both Node.js and Python, which will be covered in a separate post.

---

#### A note on JVM languages

For JVM-based languages, such as Java, Kotlin, Scala, JNI provides a similar integration. This will be covered in a separate post.

---

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

Unfortunately, in C it's very possible to accidentally access **undefined elements** of an array in C, which can lead to **undefined behavior**. Array bounds are not checked at runtime, so if you access elements beyond the valid range, the program won't generate an error immediately—it may produce garbage values, crash, or exhibit unexpected behavior.

#### Strings

**Strings** are represented as arrays of characters, with the key distinction that they are **null-terminated**. This means a C string is a sequence of characters followed by a special character '\0' (null character), which indicates the end of the string.

When you want to pass a string without modifying it, you normally use `const char*` as the parameter type. This ensures the function doesn't accidentally modify the string. If you want the function to modify the string, simply use `char*` as the parameter type.

#### Functions

A function has a return type, name, optional parameters, and a body. Functions can return a value or be of type void (if they don't return anything). Parameters are placeholders for values passed when calling the function, known as arguments. Local variables exist only within the function they are defined in. Functions can be recursive, calling themselves to solve problems in smaller steps.

#### Type aliasing

In C, `typedef` is a keyword used to define aliases for existing types. It allows to create a new name (a type alias) for a type, making the code easier to read, more maintainable, and often more expressive. `typedef` can be used to alias primitive types, pointers, structs, function pointers.

## Overall approach

Due to the multiple challenges that FFI introduces, I decided to 'go [KISS](https://en.wikipedia.org/wiki/KISS_principle)'.

As I started working on XFrames, I originally targeted WebAssembly. To avoid juggling pointers and whatnot between JS and C++, I thought I would send JSON-serialized data to the C++ (and vice versa). Whilst the marshalling and unmarshalling does have a performance cost, it does mean we don't need to do any mapping of complex data types (particularly structs and classes). Moreover, it refrains us from directly manipulating the inner state of objects and other data structures - rather we can do so by invoking functions. What this also means is that the public interface is relatively compact and straightforward.

All that being said, unfortunately C++ and FFI do not always get on well, notably due to the notoriously aggressive [name mangling](https://en.wikipedia.org/wiki/Name_mangling).
Whether we like it or not, C is still the lingua franca of programming: almost every single respectable programming language has FFI support for C libraries. This prompted me to write a [thin C wrapper library](https://github.com/xframes-project/xframes-shared-c-library) to make it as straightforward as possible to interact with XFrames.

---

### C library interface

The following assumes that you are familiar with the basic C concepts described above.

#### How to avoid name mangling issues

Let's have a look at the first part of the C library interface definition:

```c showLineNumbers
#ifdef _WIN32
#define EXPORT_API __declspec(dllexport)  // Import symbols from DLL
#else
#define EXPORT_API __attribute__((visibility("default")))  // For non-Windows
#endif
```

This is a **preprocessor conditional statement** used to define the `EXPORT_API` **macro** for _symbol visibility_, specifically for controlling how functions or variables are exported from shared libraries (DLLs on Windows or shared objects on other platforms like Linux or macOS). Exporting symbols ensures that functions or variables in a shared library can be used by other programs. In Windows, this is done with `__declspec(dllexport)`, while in Linux and other Unix-like systems, it is done with `__attribute__((visibility("default")))`.

On Windows you can run `dumpbin /exports xframesshared.dll`:

```powershell
        # [...]
        376  177 00010FA5 appendChild
        377  178 00011B26 appendTextToClippedMultiLineTextRenderer
        378  179 00006EBF elementInternalOp
        379  17A 00012C51 getChildren
        380  17B 000119EB getStyle
        381  17C 00004917 init
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

Now that we have explained what `EXPORT_API` is, we can have a look at the `init` function:

```c showLineNumbers
typedef void (*OnInitCb)();
typedef void (*OnTextChangedCb)(int, const char*);
typedef void (*OnComboChangedCb)(int, int);
typedef void (*OnNumericValueChangedCb)(int, float);
typedef void (*OnBooleanValueChangedCb)(int, bool);
typedef void (*OnMultipleNumericValuesChangedCb)(int, float*, int numValues);
typedef void (*OnClickCb)(int);

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
```

The [full source code for the C library](https://github.com/xframes-project/xframes-shared-c-library) is available on GitHub.

#### A brief yet important note on threading

As you may have guessed, `init()` initialises XFrames. There's something important about the this function: this function gets invoked in a **separate thread**. This means that the programming language must be able to define thread-safe callback functions. Neither Perl nor PHP support this, resulting in a segmentation fault as soon as the `onInit` callback is called.

A brief description of each parameter:

| Parameter                      | Type                           | Description                                                                                                                                                                                         |
| ------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| assetsBasePath                 | null-terminated string pointer | tells the engine where to find font files and other assets (images, etc.)                                                                                                                           |
| rawFontDefinitions             | null-terminated string pointer | JSON-encoded structure containing font definition pairs (font name + size)                                                                                                                          |
| rawStyleOverrideDefinitions    | null-terminated string pointer | JSON-encoded structure containing theming properties                                                                                                                                                |
| onInit                         | function pointer               | invoked **as soon as the engine has been initialized** and is ready to receive messages                                                                                                             |
| onTextChanged                  | function pointer               | invoked whenever the value of a text widget changes (`int` identifies the widget ID, `const char*` is the current value)                                                                            |
| onComboChanged                 | function pointer               | invoked whenever the selected index of a numeric widget changes (`int` identifies the widget ID, `float` is the current value)                                                                      |
| onBooleanValueChanged          | function pointer               | invoked whenever the state of a checkbox widget changes (`int` identifies the widget ID, bool` indicates the checked/unchecked state)                                                               |
| onMultipleNumericValuesChanged | function pointer               | invoked whenever any of the values of a multi-value widget changes (the first `int` identifies the widget ID, `float*` points at the float array, the second `int` indicates the size of the array) |
| onClick                        | function pointer               | invoked whenever the 'clicked' event for a widget is triggered (`int` identifies the widget ID)                                                                                                     |

Time to look at the second function:

```c showLineNumbers
EXPORT_API void setElement(const char* elementJson);
```

`elementJson`, as the name of the parameter implies, is a JSON-serialized representation of the UI element being created.

Finally, here is our third function:

```c
EXPORT_API void setChildren(int id, const char* childrenIds);
```

`id` represents the ID of the parent widget, whereas `childrenIds` is a JSON-serialized array of child widget ID. Truth be told, `childrenIds` _could_ be replaced like so:

```c showLineNumbers
EXPORT_API void setChildren(int id, const int* childrenIds, int num_children);
```

If you are coming from interpreted languages you'll likely find both approaches somewhat cumbersome.

---

### .NET (so far C# and F#)

.NET is a cross-platform, open-source runtime and framework that allows you to build applications for web, desktop, mobile, cloud, IoT, and even gaming. .NET provides a runtime for multiple languages, primarily C#, F#, and VB.NET. I have only written a basic demo application for [C#](https://learn.microsoft.com/en-us/dotnet/csharp/tour-of-csharp/overview) and [F#](https://learn.microsoft.com/en-us/dotnet/fsharp/what-is-fsharp), however. I tested both the C# and F# demo applications with .NET 9.

### C#

In general I have found [C#](https://learn.microsoft.com/en-us/dotnet/csharp/)'s FFI support very intuitive and convenient through [DllImportClass](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.dllimportattribute?view=net-9.0) and [Delegates](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/using-delegates):

```csharp showLineNumbers
public delegate void OnInitCb();
public delegate void OnTextChangedCb(int id, string value);
public delegate void OnComboChangedCb(int id, int index);
public delegate void OnNumericValueChangedCb(int id, float value);
public delegate void OnBooleanValueChangedCb(int id, bool value);
public delegate void OnMultipleNumericValuesChangedCb(int id, IntPtr rawValues, int numValues);
public delegate void OnClickCb(int id);

[DllImport("xframesshared.dll", CallingConvention = CallingConvention.Cdecl)]
public static extern void init(
    string assetsBasePath,
    string rawFontDefinitions,
    string rawStyleOverrideDefinitions,
    OnInitCb onInit,
    OnTextChangedCb onTextChanged,
    OnComboChangedCb onComboChanged,
    OnNumericValueChangedCb onNumericValueChanged,
    OnBooleanValueChangedCb onBooleanValueChanged,
    OnMultipleNumericValuesChangedCb onMultipleNumericValuesChanged,
    OnClickCb onClick
);

public static float[] MarshalFloatArray(IntPtr ptr, int length)
{
    float[] array = new float[length];
    Marshal.Copy(ptr, array, 0, length);
    return array;
}

OnInitCb onInit = () => {
    Console.WriteLine("Initialization callback called!");
};

OnTextChangedCb onTextChanged = (int id, string value) => { };
OnComboChangedCb onComboChanged = (int id, int index) => { };
OnNumericValueChangedCb onNumericValueChanged = (int id, float value) => { };
OnBooleanValueChangedCb onBooleanValueChanged = (int id, bool value) => { };
OnMultipleNumericValuesChangedCb onMultipleNumericValuesChanged = (int id, IntPtr rawValues, int numValues) => {
    float[] values = MarshalFloatArray(rawValues, numValues);
};
OnClickCb onClick = (int id) => { };

init("./assets", fontDefsJson, theme2Json, onInit, onTextChanged, onComboChanged, onNumericValueChanged, onBooleanValueChanged, onMultipleNumericValuesChanged, onClick);
```

Whilst C# takes care of converting strings to null-terminated ones that the C layer can handle, `onMultipleNumericValuesChanged` receives a raw pointer (the array of floats). Accessing the values requires marshalling - an example can be found in `MarshalFloatArray`.

Resources:

- [Source code](https://github.com/xframes-project/xframes-csharp)
- [Interoperating with unmanaged code](https://learn.microsoft.com/en-us/dotnet/framework/interop/)
- [Consuming Unmanaged DLL Functions](https://learn.microsoft.com/en-us/dotnet/framework/interop/consuming-unmanaged-dll-functions)
- [DllImportClass](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.dllimportattribute?view=net-9.0)
- [Delegates](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/delegates/using-delegates)

### F#

[F#](https://learn.microsoft.com/en-us/dotnet/fsharp/)'s FFI support is very similar to C#'s.

```fsharp showLineNumbers
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

let onInitLogic () =
    printfn "Initialized"

let marshalFloatArray (ptr: IntPtr) (length: int) : float[] =
    let managedArray = Array.zeroCreate<float> length
    Marshal.Copy(ptr, managedArray, 0, length)
    managedArray

let onTextChangedDelegate = OnTextChangedCb(fun id value -> printfn "Text changed: %d, %s" id value)
let onComboChangedDelegate = OnComboChangedCb(fun id value -> printfn "Value changed: %d, %d" id value)
let onNumericValueChanged = OnNumericValueChangedCb(fun id value -> printfn "Value changed: %d, %f" id value)
let onBooleanValueChanged = OnBooleanValueChangedCb(fun id value -> printfn "Value changed: %d, %b" id value)
let onMultipleNumericValuesChanged = OnMultipleNumericValuesChangedCb(fun id rawValues numValues ->
    for value in marshalFloatArray rawValues numValues do
        printfn "Value: %f" value)
let onClickDelegate = OnClickCb(fun id -> WidgetRegistrationService.dispatchOnClickEvent(id))

let onInit = Marshal.GetFunctionPointerForDelegate(Action(fun () -> onInitLogic()))
let onTextChangedPtr = Marshal.GetFunctionPointerForDelegate(onTextChangedDelegate)
let onComboChangedPtr = Marshal.GetFunctionPointerForDelegate(onComboChangedDelegate)
let onNumericValueChangedPtr = Marshal.GetFunctionPointerForDelegate(onNumericValueChanged)
let onBooleanValueChangedPtr = Marshal.GetFunctionPointerForDelegate(onBooleanValueChanged)
let onMultipleNumericValuesChangedPtr = Marshal.GetFunctionPointerForDelegate(onMultipleNumericValuesChanged)
let onClickPtr = Marshal.GetFunctionPointerForDelegate(onClickDelegate)

init(assetsPath, fontDefsJson, themeJson, onInit, onTextChangedPtr, onComboChangedPtr, onNumericValueChangedPtr, onBooleanValueChangedPtr, onMultipleNumericValuesChangedPtr, onClickPtr)
```

As `onInit` has no parameters, we can leverage [Action](https://learn.microsoft.com/en-us/dotnet/api/system.action-1?view=net-9.0) to wrap it as a function pointer.

The float array in `onMultipleNumericValuesChanged` still needs marshalling before values can be accessed. There's some extra work required in order to pass function pointers through [Marshal.GetFunctionPointerForDelegate](https://learn.microsoft.com/en-us/dotnet/api/system.runtime.interopservices.marshal.getfunctionpointerfordelegate?view=net-9.0).

Resources:

- [Source code](https://github.com/xframes-project/xframes-fsharp)
- [External Functions](https://learn.microsoft.com/en-us/dotnet/fsharp/language-reference/functions/external-functions)

---

### Ada

[Ada](https://www.adacore.com/about-ada) is a high-level, strongly-typed, and safety-oriented programming language primarily used in systems where reliability, maintainability, and real-time performance are crucial — think aerospace, defense, transportation, and high-integrity systems. As such, it is also notoriously verbose.

Before diving in, let's analyze briefly how we can map the `init` external C function.

```ada showLineNumbers
procedure Init
    (Assets_Base_Path              : in Interfaces.C.char_array;
    Raw_Font_Definitions           : in Interfaces.C.char_array;
    Raw_Style_Override_Definitions : in Interfaces.C.char_array;
    OnInit                         : System.Address;
    OnTextChanged                  : System.Address;
    OnComboChanged                 : System.Address;
    OnNumericValueChanged          : System.Address;
    OnBooleanValueChanged          : System.Address;
    MultipleNumericValuesChanged   : System.Address;
    OnClick                        : System.Address);
pragma Import (C, Init, "init");
```

As you can see, most of the parameters of `Init` are either C-style character arrays (`Interfaces.C.char_array`) or addresses (`System.Address`), which are typical when interfacing with C functions.

#### Parameter Types

- `Interfaces.C.char_array`:
  This is a type provided by the `Interfaces.C` package to represent C-style arrays of characters (similar to C strings).
- `System.Address`:
  This type represents a generic memory address, commonly used to pass function pointers or callback addresses when interfacing with C.

#### `pragma Import` Directive

This tells the Ada compiler that the Init procedure corresponds to an external C function. The first argument C specifies that the external function is written in C. The second argument `Init` is the name of the Ada procedure being mapped. The third argument `"init"` is the name of the C function to which the Ada procedure Init is bound.

#### Full solution

I tested this code with Ada [2022](https://learn.adacore.com/courses/whats-new-in-ada-2022/index.html), [Alire](https://alire.ada.dev/) 2.0.2.

```ada showLineNumbers
with System;                use System;
with Interfaces.C;          use Interfaces.C;
with Ada.Text_IO;           use Ada.Text_IO;
with Ada.Strings.Unbounded; use Ada.Strings.Unbounded;
with Ada.Float_Text_IO;     use Ada.Float_Text_IO;
with Ada.Strings.Hash;
with GNATCOLL.Strings;      use GNATCOLL.Strings;

procedure Main is
    -- We need a type alias for the float array
    type Float_Array is array (Positive range <>) of aliased Float;

    -- OnInit callback, definition and body
    procedure OnInit;
    pragma Convention (C, OnInit);

    procedure OnInit is
    begin
        Put_Line ("Initialized");
    end OnInit;

    -- OnTextChanged callback, definition and body
    procedure OnTextChanged
        (Id : Integer; Text : in Interfaces.C.char_array);
    pragma Convention (C, OnTextChanged);

    procedure OnTextChanged
        (Id : Integer; Text : in Interfaces.C.char_array) is
    begin
        Put_Line
        ("OnTextChanged called with ID: "
            & Integer'Image (Id)
            & " and Text: ");
    end OnTextChanged;

    -- OnComboChanged callback, definition and body
    procedure OnComboChanged (Id : Integer; Selected_Option_Id : Integer);
    pragma Convention (C, OnComboChanged);

    procedure OnComboChanged (Id : Integer; Selected_Option_Id : Integer) is
    begin
        Put_Line
        ("OnComboChanged called with ID: " & Integer'Image (Id) & " and: ");
    end OnComboChanged;

    -- OnNumericValueChanged callback, definition and body
    procedure OnNumericValueChanged (Id : Integer; Value : Float);
    pragma Convention (C, OnNumericValueChanged);

    procedure OnNumericValueChanged (Id : Integer; Value : Float) is
    begin
        Put_Line
        ("Callback called with ID: "
            & Integer'Image (Id)
            & " and Value: "
            & Float'Image (Value));
    end OnNumericValueChanged;

    -- OnBooleanValueChanged callback, definition and body
    procedure OnBooleanValueChanged (Id : Integer; Value : Boolean);
    pragma Convention (C, OnBooleanValueChanged);

    procedure OnBooleanValueChanged (Id : Integer; Value : Boolean) is
    begin
        Put_Line
        ("OnBooleanValueChanged called with ID: "
            & Integer'Image (Id)
            & " and Value: "
            & Boolean'Image (Value));
    end OnBooleanValueChanged;

    -- OnMultipleNumericValuesChanged callback, definition and body
    procedure OnMultipleNumericValuesChanged
        (Id : Integer; Values : access Float_Array; NumValues : Integer);
    pragma Convention (C, OnMultipleNumericValuesChanged);

    procedure OnMultipleNumericValuesChanged
        (Id : Integer; Values : access Float_Array; NumValues : Integer) is
    begin
        Ada.Text_IO.Put_Line
        ("OnMultipleNumericValuesChanged numeric values changed callback invoked.");
        Ada.Text_IO.Put_Line ("ID: " & Integer'Image (Id));
        Ada.Text_IO.Put_Line ("Number of Values: " & Integer'Image (NumValues));

        for I in 1 .. NumValues loop
            Ada.Text_IO.Put_Line
            ("Value " & Integer'Image (I) & ": " & Float'Image (Values (I)));
        end loop;
    end OnMultipleNumericValuesChanged;

    -- OnClick callback, definition and body
    procedure OnClick (Id : Integer; Value : Boolean);
    pragma Convention (C, OnClick);

    procedure OnClick (Id : Integer; Value : Boolean) is
    begin
        Put_Line ("OnClick called with ID: " & Integer'Image (Id));
    end OnClick;

    -- Assets_Base_Path does not change hence it can be defined as a constant
    Assets_Base_Path               : constant String := "./assets";
    Assets_Base_Path_C             : Interfaces.C.char_array := To_C (Assets_Base_Path);

    -- Both Raw_Font_Definitions and Raw_Style_Override_Definitions must be declared...
    Raw_Font_Definitions           : String := "";
    Raw_Style_Override_Definitions : String := "";

    -- ... and pre-allocated
    Raw_Font_Definitions_C           : Interfaces.C.char_array (1 .. 1024 * 5);
    Raw_Style_Override_Definitions_C : Interfaces.C.char_array (1 .. 1024 * 10);

    Raw_Font_Definitions_String_Length           : Size_T;
    Raw_Style_Override_Definitions_String_Length : Size_T;

    -- Captures function addresses, aka pointers
    OnInit_Address                         : System.Address := OnInit'Address;
    OnTextChanged_Address                  : System.Address := OnTextChanged'Address;
    OnComboChanged_Address                 : System.Address := OnComboChanged'Address;
    OnNumericValueChanged_Address          : System.Address := OnNumericValueChanged'Address;
    OnBooleanValueChanged_Address          : System.Address := OnBooleanValueChanged'Address;
    OnMultipleNumericValuesChanged_Address : System.Address := OnMultipleNumericValuesChanged'Address;
    OnClick_Address                        : System.Address := OnClick'Address;

    procedure Init
        (Assets_Base_Path              : in Interfaces.C.char_array;
        Raw_Font_Definitions           : in Interfaces.C.char_array;
        Raw_Style_Override_Definitions : in Interfaces.C.char_array;
        OnInit                         : System.Address;
        OnTextChanged                  : System.Address;
        OnComboChanged                 : System.Address;
        OnNumericValueChanged          : System.Address;
        OnBooleanValueChanged          : System.Address;
        MultipleNumericValuesChanged   : System.Address;
        OnClick                        : System.Address);
    pragma Import (C, Init, "init");

    begin
        -- Converts Ada strings to null-terminated C strings
        To_C
            (Item      => Font_Definitions_As_JSON_Value.Write,
            Target     => Raw_Font_Definitions_C,
            Count      => Raw_Font_Definitions_String_Length,
            Append_Nul => True);

        To_C
            (Item       => Theme.Write,
            Target     => Raw_Style_Override_Definitions_C,
            Count      => Raw_Style_Override_Definitions_String_Length,
            Append_Nul => True);

        -- Finally, call `Init`
        Init
            (Assets_Base_Path_C,
            Raw_Font_Definitions_C,
            Raw_Style_Override_Definitions_C,
            OnInit_Address,
            OnTextChanged_Address,
            OnComboChanged_Address,
            OnNumericValueChanged_Address,
            OnBooleanValueChanged_Address,
            OnMultipleNumericValuesChanged_Address,
            OnClick_Address);

end Main;
```

Resources:

- [Source code](https://github.com/xframes-project/xframes-ada)
- [Ada's Interfacing with C](https://learn.adacore.com/courses/intro-to-ada/chapters/interfacing_with_c.html)

---

### Lua

[Lua](https://www.lua.org/) is a lightweight, fast, dynamically typed, and embeddable scripting language, perfect for use cases where one needs extensibility or want to add scripting capabilities to an application. It's popular in game development, embedded systems, and tools like Nginx and Redis.

I tested this code with Lua's Just-In-Time (JIT) compiler called [LuaJIT](https://luajit.org/), which significantly boosts performance by compiling Lua code into native machine code at runtime.

I tested this code using LuaJIT 2.1.

```lua showLineNumbers
local ffi = require("ffi")

ffi.cdef[[
    typedef void (*OnInitCb)();
    typedef void (*OnTextChangedCb)(int widgetId, const char* text);
    typedef void (*OnComboChangedCb)(int widgetId, int selectedIndex);
    typedef void (*OnNumericValueChangedCb)(int widgetId, double value);
    typedef void (*OnBooleanValueChangedCb)(int widgetId, bool value);
    typedef void (*OnMultipleNumericValuesChangedCb)(int widgetId, double* values, int count);
    typedef void (*OnClickCb)(int widgetId);

    void init(
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
]]

-- Load the shared library
local xframes = ffi.load("xframesshared")

local function onInit()
    print("Initialization complete!")
end

local function onTextChanged(widgetId, value)
    print("Text changed:", ffi.string(text))
end

local function onComboChanged(widgetId, selectedIndex)
    print("Combo selection changed to index:", selectedIndex)
end

local function onNumericValueChanged(widgetId, value)
    print("Numeric value changed to:", value)
end

local function onBooleanValueChanged(widgetId, value)
    print("Boolean value changed to:", value == 1 and "true" or "false")
end

local function onMultipleNumericValuesChanged(widgetId, values, count)
    for i = 0, count - 1 do
        print("Value", i + 1, ":", values[i])
    end
end

local function onClick(widgetId)
    print("Button clicked!")
end

xframes.init(
    "./assets",
    fontDefsJson,
    theme2Json,
    ffi.cast("OnInitCb", onInit),
    ffi.cast("OnTextChangedCb", onTextChanged),
    ffi.cast("OnComboChangedCb", onComboChanged),
    ffi.cast("OnNumericValueChangedCb", onNumericValueChanged),
    ffi.cast("OnBooleanValueChangedCb", onBooleanValueChanged),
    ffi.cast("OnMultipleNumericValuesChangedCb", onMultipleNumericValuesChanged),
    ffi.cast("OnClickCb", onClick)
)

```

Resources:

- [Source code](https://github.com/xframes-project/xframes-ada)
- [LuaJIT's FFI semantics](https://luajit.org/ext_ffi_semantics.html).

### OCaml

[OCaml](https://ocaml.org/) is a functional programming language, but it also supports imperative and object-oriented programming paradigms. It has a strong static type system and focuses on higher-order functions, immutable data, [pattern matching](https://ocaml.org/manual/5.2/patterns.html), and on recursion over loops.

The following has been tested with OCaml 4.14.1 and [Dune](https://dune.build/), both were installed through [Opam](https://opam.ocaml.org/) 2.2.0.

```ocaml showLineNumbers
open Ctypes
open Foreign

let on_init_callback = (funptr (void @-> returning void))
let on_text_changed_callback = (funptr (int @-> string @-> returning void))
let on_combo_changed_callback = (funptr (int @-> int @-> returning void))
let on_numeric_value_changed_callback = (funptr (int @-> float @-> returning void))
let on_boolean_value_changed_callback = (funptr (int @-> bool @-> returning void))
let on_multiple_numeric_values_changed_callback = (funptr (int @-> ptr float @-> int @-> returning void))
let on_click_callback = (funptr (int @-> returning void))

let xframeslib = Dl.dlopen ~filename:"xframesshared.dll" ~flags:[Dl.RTLD_NOW]

let init =
  foreign ~from:xframeslib "init"
                    (string @->
                      string @->
                        string @->
                          on_init_callback @->
                            on_text_changed_callback @->
                              on_combo_changed_callback @->
                                on_numeric_value_changed_callback @->
                                  on_boolean_value_changed_callback @->
                                    on_multiple_numeric_values_changed_callback @->
                                      on_click_callback @->
                                        returning void)

let on_init () = Printf.printf "Initialized\n"
let on_text_changed id value = Printf.printf "Text changed for widget %d: %s\n" id value
let on_combo_changed id selected_index = Printf.printf "Combo changed for widget %d: %d\n" id selected_index
let on_numeric_value_changed id value = Printf.printf "Numeric value changed for widget %d: %f\n" id value
let on_boolean_value_changed id value = Printf.printf "Boolean value changed for widget %d: %b\n" id value
let on_multiple_numeric_values_changed some_id values_ptr num_values =
  let values =
    List.init num_values (fun i ->
      !@(values_ptr +@ i)
    )
  in
  Printf.printf "ID: %d, Values: [%s]\n"
    some_id
    (String.concat ", " (List.map string_of_float values))
let on_click id =
  Printf.printf "Clicked event received for widget: %d\n" id

let () =
  init
    "./assets"
    font_defs_json
    theme_json
    on_init
    on_text_changed
    on_combo_changed
    on_numeric_value_changed
    on_boolean_value_changed
    on_multiple_numeric_values_changed
    on_click
```

Conveniently, OCaml takes care of string conversions and function pointers for us.

Resources:

- [Source code](https://github.com/xframes-project/xframes-ocaml)
- [Interfacing C with OCaml](https://ocaml.org/manual/4.14/intfc.html)

### Racket

[Racket](https://download.racket-lang.org/releases/8.15/doc/quick/index.html) is a Lisp dialect—meaning its syntax is based on parentheses and prefix notation. It uses lots of parentheses to denote function calls. One of Racket's most powerful features is its ability to manipulate code as data. This is made possible through macros, which allow you to extend the language itself by creating new syntax and abstractions.

I used VS Code to write the code (instead of [DrRacket](https://github.com/racket/drracket)). I tested the code using Racket v8.15 and the [raco](https://docs.racket-lang.org/raco/) CLI tool.

```racket showLineNumbers
#lang racket
(require ffi/unsafe
         racket/match
         racket/runtime-path)

(define xframes
  (match (system-type)
    ['unix (ffi-lib "./libxframesshared.so")]
    ['windows (ffi-lib "./xframesshared.dll")]))


(define _OnInitCb (_fun #:async-apply (lambda (f) (f)) -> _void))
(define _OnTextChangedCb (_fun #:async-apply (lambda (f) (f)) _int _string -> _void))
(define _OnComboChangedCb (_fun #:async-apply (lambda (f) (f)) _int _int -> _void))
(define _OnNumericValueChangedCb (_fun #:async-apply (lambda (f) (f)) _int _float -> _void))
(define _OnBooleanValueChangedCb (_fun #:async-apply (lambda (f) (f)) _int _bool -> _void))
(define _OnMultipleNumericValuesChangedCb (_fun #:async-apply (lambda (f) (f)) _int _pointer _int -> _void))
(define _OnClickCb (_fun #:async-apply (lambda (f) (f)) _int _bool -> _void))

(define init
  (get-ffi-obj "init" xframes (
    _fun
        _string
        _string
        _string
        _OnInitCb
        _OnTextChangedCb
        _OnComboChangedCb
        _OnNumericValueChangedCb
        _OnBooleanValueChangedCb
        _OnMultipleNumericValuesChangedCb
        _OnClickCb
         -> _void)))

(define (onInit)
    (begin
        (displayln "init")
    )
)

(define (onInit)
    (displayln "init"))

(define (onTextValueChanged id value)
    (displayln (string-append "onTextValueChanged: id = " (number->string id) ", value = " value)))

(define (onComboValueChanged id selected-index)
    (displayln (string-append "onComboValueChanged: id = " (number->string id) ", value = " (number->string selected-index))))

(define (onNumericValueChanged id value)
    (displayln (format "onNumericValueChanged: id = ~a, value = ~a" id value)))

(define (onBooleanValueChanged id value)
    (displayln (string-append "onBooleanValueChanged: id = "
                           (number->string id)
                           ", value = " (if value "true" "false"))))

(define (onMultipleNumericValuesChanged id values-pointer num-values)
  (define values (pointer->array values-pointer num-values))
  (displayln "onMultipleNumericValuesChanged")
  (for-each
   (lambda (value)
     (displayln (format "Value: ~a" value)))
   values))

(define (onClick id)
  (displayln (string-append "onClick: id = " (number->string id))))

(init
    "./assets"
    font-defs
    theme
    onInit
    onTextValueChanged
    onComboValueChanged
    onNumericValueChanged
    onBooleanValueChanged
    onMultipleNumericValuesChanged
    onClick
)
```

The `#:async-apply` keyword indicates that the function being defined should be applied asynchronously. This means that instead of blocking the calling thread, the function can return immediately and perform its operation in the background or on a different thread, allowing the program to continue executing. Without this, this demo Racket application hangs as soon as we call `init`.

Resources:

- [Source code](https://github.com/xframes-project/xframes-racket)
- [The Racket foreign interface](https://download.racket-lang.org/releases/8.15/doc/foreign/index.html)

### Fortran

Fortran is one of the oldest high-level programming languages and is primarily used for scientific, mathematical, and engineering applications.
This code requires [Fortran 2008](https://fortranwiki.org/fortran/show/Fortran+2008) or later.

```fortran showLineNumbers
module c_interface
    use, intrinsic :: iso_c_binding
    implicit none

    interface
        subroutine init(assetsBasePath, rawFontDefinitions, rawStyleOverrideDefinitions, onInit, onTextChanged, onComboChanged, onNumericValueChanged, onBooleanValueChanged, onMultipleNumericValuesChanged, onClick) bind(C, name="init")
            import :: c_char, c_funptr, c_ptr
            type (c_ptr), value :: assetsBasePath
            type (c_ptr), value :: rawFontDefinitions
            type (c_ptr), value :: rawStyleOverrideDefinitions
            type(c_funptr), intent(in), value :: onInit
            type(c_funptr), intent(in), value :: onTextChanged
            type(c_funptr), intent(in), value :: onComboChanged
            type(c_funptr), intent(in), value :: onNumericValueChanged
            type(c_funptr), intent(in), value :: onBooleanValueChanged
            type(c_funptr), intent(in), value :: onMultipleNumericValuesChanged
            type(c_funptr), intent(in), value :: onClick
        end subroutine init
    end interface
end module c_interface

program main
    use c_interface
    use iso_c_binding
    use, intrinsic :: iso_fortran_env, only: wp => real64
    implicit none

    type(c_funptr) :: onInitPtr, onTextChangedPtr, onComboChangedPtr
    type(c_funptr) :: onNumericValueChangedPtr, onBooleanValueChangedPtr, onMultipleNumericValuesChangedPtr, onClickPtr

    character(len=40,kind=c_char), allocatable, target :: assetsBasePath
    type(c_ptr), allocatable :: assetsBasePath_ptr

    character(len=:,kind=c_char), allocatable, target :: fontDefsJson
    character(len=:,kind=c_char), allocatable, target :: themeJson

    type(c_ptr), allocatable :: fontDefsJson_ptr
    type(c_ptr), allocatable :: themeJson_ptr

    allocate(assetsBasePath)
    assetsBasePath = "./assets"//C_NULL_CHAR
    assetsBasePath_ptr = c_loc(assetsBasePath)

    fontDefsJson = fontDefsJson // C_NULL_CHAR
    themeJson = themeJson // C_NULL_CHAR

    onInitPtr = c_funloc(myInit)
    onTextChangedPtr = c_funloc(myTextChanged)
    onComboChangedPtr = c_funloc(myComboChanged)
    onNumericValueChangedPtr = c_funloc(myNumericValueChanged)
    onBooleanValueChangedPtr = c_funloc(myBooleanValueChanged)
    onMultipleNumericValuesChangedPtr = c_funloc(myMultipleNumericValuesChanged)
    onClickPtr = c_funloc(myClick)

    fontDefsJson_ptr = c_loc(fontDefsJson)
    themeJson_ptr = c_loc(themeJson)

    call init(assetsBasePath_ptr, fontDefsJson_ptr, themeJson_ptr, onInitPtr, onTextChangedPtr, onComboChangedPtr, onNumericValueChangedPtr, onBooleanValueChangedPtr, onMultipleNumericValuesChangedPtr, onClickPtr)

    deallocate(assetsBasePath_ptr)
    deallocate(fontDefsJson_ptr)
    deallocate(themeJson_ptr)

contains
    subroutine myInit() bind(C)
        print *, "Initialization callback invoked."

        call make_node()
        call make_unformatted_text()
        call set_children()
    end subroutine myInit

    subroutine myTextChanged(index, text) bind(C)
        use iso_c_binding, only: c_int, c_char
        integer(c_int), value :: index
        character(c_char), dimension(*), intent(in) :: text

        print *, "Text changed callback. Index:", index
    end subroutine myTextChanged

    subroutine myComboChanged(index, value) bind(C)
        use iso_c_binding, only: c_int
        integer(c_int), value :: index
        integer(c_int), value :: value

        print *, "Combo changed callback. Index:", index, "Value:", value
    end subroutine myComboChanged

    subroutine myNumericValueChanged(index, value) bind(C)
        use iso_c_binding, only: c_int, c_float
        integer(c_int), value :: index
        real(c_float), value :: value

        print *, "Numeric value changed callback. Index:", index, "Value:", value
    end subroutine myNumericValueChanged

    subroutine myBooleanValueChanged(index, value) bind(C)
        use iso_c_binding, only: c_int, c_bool
        integer(c_int), value :: index
        logical(c_bool), value :: value

        print *, "Boolean value changed callback. Index:", index, "Value:", value
    end subroutine myBooleanValueChanged

    subroutine myMultipleNumericValuesChanged(index, values, numValues) bind(C)
        use iso_c_binding, only: c_int, c_float
        integer(c_int), value :: index
        real(c_float), dimension(*), intent(in) :: values
        integer(c_int), value :: numValues

        integer :: i

        print *, "Multiple numeric values changed callback. Index:", index, "Num values:", numValues

        ! Loop through and print the values in the array
        do i = 1, numValues
            print *, "Value ", i, ": ", values(i)
        end do
    end subroutine myMultipleNumericValuesChanged

    subroutine myClick(index) bind(C)
        use iso_c_binding, only: c_int
        integer(c_int), value :: index

        print *, "Click callback. Index:", index
    end subroutine myClick

end program main

```

We mapped C strings (`const char*`) to [c_ptr](https://gcc.gnu.org/onlinedocs/gfortran/Working-with-C-Pointers.html) and the callbacks to `c_funptr`.

Some extra work for the string conversion was necessary, as we had to manually append the NULL character. `AssetsBasePath` is pre-allocated as 40 bytes, whereas the raw JSON definitions are 'allocatable' at run time.

Additionally, we have had to wrap strings with calls to [c_loc](https://gcc.gnu.org/onlinedocs/gfortran/C_005fLOC.html) and subroutines with [c_funloc](https://gcc.gnu.org/onlinedocs/gfortran/C_005fFUNLOC.html) to obtain the C address of a objects and procedures respectively.

Finally, we [deallocate](https://www.intel.com/content/www/us/en/docs/fortran-compiler/developer-guide-reference/2023-1/deallocate.html) the strings.

Resources:

- [Source code](https://github.com/xframes-project/xframes-fortran)
- [Interoperability with C](https://gcc.gnu.org/onlinedocs/gfortran/Interoperability-with-C.html)

### Delphi

[Delphi](https://www.embarcadero.com/products/delphi) uses explicit memory allocation (new, dispose), not garbage collection. Objects passed to C must remain valid throughout the FFI call. Delphi won't deallocate memory passed to C unless explicitly managed.

```pascal showLineNumbers
program XFrames;

uses
  System.SysUtils,
  System.AnsiStrings;

type
  TOnInitCb = procedure; cdecl;
  TOnTextChangedCb = procedure(ID: Integer; Text: PAnsiChar); cdecl;
  TOnComboChangedCb = procedure(ID: Integer; Index: Integer); cdecl;
  TOnNumericValueChangedCb = procedure(ID: Integer; Value: Single); cdecl;
  TOnBooleanValueChangedCb = procedure(ID: Integer; Value: Boolean); cdecl;
  TOnMultipleNumericValuesChangedCb = procedure(ID: Integer; Values: PSingle; NumValues: Integer); cdecl;
  TOnClickCb = procedure(ID: Integer); cdecl;

procedure init(
  AssetsBasePath: PAnsiChar;
  RawFontDefinitions: PAnsiChar;
  RawStyleOverrideDefinitions: PAnsiChar;
  OnInit: TOnInitCb;
  OnTextChanged: TOnTextChangedCb;
  OnComboChanged: TOnComboChangedCb;
  OnNumericValueChanged: TOnNumericValueChangedCb;
  OnBooleanValueChanged: TOnBooleanValueChangedCb;
  OnMultipleNumericValuesChanged: TOnMultipleNumericValuesChangedCb;
  OnClick: TOnClickCb
); cdecl; external 'xframesshared.dll';

procedure MyOnInit; cdecl;
begin
  Writeln('Initialized');
end;

procedure MyOnTextChanged(ID: Integer; Text: PAnsiChar); cdecl;
begin
  Writeln('Text changed: ID = ', ID, ', Text = ', Text);
end;

procedure MyOnComboChanged(ID: Integer; Index: Integer); cdecl;
begin
  Writeln('Combo changed: ID = ', ID, ', Index = ', Index);
end;

procedure MyOnNumericValueChanged(ID: Integer; Value: Single); cdecl;
begin
  Writeln('Numeric value changed: ID = ', ID, ', Value = ', Value:0:2);
end;

procedure MyOnBooleanValueChanged(ID: Integer; Value: Boolean); cdecl;
begin
  Writeln('Boolean value changed: ID = ', ID, ', Value = ', Value);
end;

procedure MyOnMultipleNumericValuesChanged(ID: Integer; Values: PSingle; NumValues: Integer); cdecl;
var
  I: Integer;
begin
  Write('Multiple numeric values changed: ID = ', ID, ', Values = [');
  for I := 0 to NumValues - 1 do
  begin
    if I > 0 then
      Write(', ');
    Write(Values^);
    Inc(Values);  // Move the pointer to the next float
  end;
  WriteLn(']');
end;

procedure MyOnClick(ID: Integer); cdecl;
begin
  Writeln('Click event: ID = ', ID);
end;

begin
    init(
      PAnsiChar(AnsiString('./assets')),
      PAnsiChar(AnsiString(FontDefs.ToJSON)),
      PAnsiChar(AnsiString(ThemeDef.ToJSON)),
      @MyOnInit,
      @MyOnTextChanged,
      @MyOnComboChanged,
      @MyOnNumericValueChanged,
      @MyOnBooleanValueChanged,
      @MyOnMultipleNumericValuesChanged,
      @MyOnClick
    );
end.
```

We mapped C strings (`const char*`) to [PAnsiChar](https://docwiki.embarcadero.com/Libraries/Sydney/en/System.PAnsiChar) and added the [cdecl](https://docwiki.embarcadero.com/RADStudio/Sydney/en/Cdecl,_cdecl,_cdecl) modifier to the callback types.

The callbacks are passed as [pointers](https://www.freepascal.org/docs-html/ref/refse15.html) using the `@` symbol.

Resources:

- [Source code](https://github.com/xframes-project/xframes-delphi)

### (Free) Pascal

[Free Pascal](https://www.freepascal.org/) uses manual memory management, similar to C, and does not have garbage collection. Objects passed to C must remain valid throughout the FFI call. Free Pascal won't deallocate memory passed to C unless explicitly managed. [GetMem](https://www.freepascal.org/docs-html/rtl/system/getmem.html) can be used for dynamic memory allocation whereas [FreeMem](https://www.freepascal.org/docs-html/rtl/system/freemem.html) can be used for deallocation when dealing with FFI.

```pascal showLineNumbers
program XFrames;

{$mode objfpc}{$H+}

uses
  sysutils;

type
  TOnInitCb = procedure; cdecl;
  TOnTextChangedCb = procedure(id: Integer; text: PChar); cdecl;
  TOnComboChangedCb = procedure(id: Integer; index: Integer); cdecl;
  TOnNumericValueChangedCb = procedure(id: Integer; value: Single); cdecl;
  TOnBooleanValueChangedCb = procedure(id: Integer; value: Boolean); cdecl;
  TOnMultipleNumericValuesChangedCb = procedure(id: Integer; values: PSingle; numValues: Integer); cdecl;
  TOnClickCb = procedure(id: Integer); cdecl;

procedure init(
  assetsBasePath: PChar;
  rawFontDefinitions: PChar;
  rawStyleOverrideDefinitions: PChar;
  onInit: TOnInitCb;
  onTextChanged: TOnTextChangedCb;
  onComboChanged: TOnComboChangedCb;
  onNumericValueChanged: TOnNumericValueChangedCb;
  onBooleanValueChanged: TOnBooleanValueChangedCb;
  onMultipleNumericValuesChanged: TOnMultipleNumericValuesChangedCb;
  onClick: TOnClickCb
); cdecl; external 'xframesshared.dll';

procedure MyOnInit; cdecl;
begin
  WriteLn('Initialized');
end;

procedure MyOnTextChanged(id: Integer; text: PChar); cdecl;
begin
  WriteLn('Text changed: ID = ', id, ', Text = ', text);
end;

procedure MyOnComboChanged(id: Integer; index: Integer); cdecl;
begin
  WriteLn('Combo changed: ID = ', id, ', Index = ', index);
end;

procedure MyOnNumericValueChanged(id: Integer; value: Single); cdecl;
begin
  WriteLn('Numeric value changed: ID = ', id, ', Value = ', value:0:2);
end;

procedure MyOnBooleanValueChanged(id: Integer; value: Boolean); cdecl;
begin
  WriteLn('Boolean value changed: ID = ', id, ', Value = ', value);
end;

procedure MyOnMultipleNumericValuesChanged(id: Integer; values: PSingle; numValues: Integer); cdecl;
var
  i: Integer;
begin
  Write('Multiple numeric values changed: ID = ', id, ', Values = ');
  for i := 0 to numValues - 1 do
    Write(values[i]:0:2, ' ');
  WriteLn;
end;

procedure MyOnClick(id: Integer); cdecl;
begin
  WriteLn('Click event: ID = ', id);
end;

begin
    init(
      './assets',
      PChar(fontDefs.AsJSON),
      PChar(themeDef.AsJSON),
      @MyOnInit,
      @MyOnTextChanged,
      @MyOnComboChanged,
      @MyOnNumericValueChanged,
      @MyOnBooleanValueChanged,
      @MyOnMultipleNumericValuesChanged,
      @MyOnClick
    );
end.
```

We mapped C strings (`const char*`) to [PChar](https://wiki.freepascal.org/PChar) and added the [cdecl](https://www.freepascal.org/docs-html/ref/refsu73.html) modifier to the callback types.

The callbacks are passed as [pointers](https://www.freepascal.org/docs-html/ref/refse15.html) using the `@` symbol.

Resources:

- [Source code](https://github.com/xframes-project/xframes-freepascal)

### Nim

[Nim](https://nim-lang.org/) uses garbage collection for most objects but requires manual memory management when working with FFI and external libraries. Objects passed to C functions via pointers must remain valid for the entire FFI call. Memory must be manually freed when working with C. `alloc` can be used for dynamic memory allocation whereas `dealloc` can be used for deallocation when dealing with FFI.

```nim showLineNumbers
import dynlib

when defined(windows):
  const ffiLib = "./xframesshared.dll"
elif defined(linux):
  const ffiLib = "./libxframesshared.so"
elif defined(macosx):
  const ffiLib = "./libxframesshared.dylib"
elif defined(bsd):
  const ffiLib = "./libxframesshared.so"
else:
  echo "Unsupported platform"
  quit(1)

proc init(
    assetsBasePath: cstring,
    rawFontDefinitions: cstring,
    rawStyleOverrideDefinitions: cstring,
    onInit: proc(): void {.cdecl.},
    onTextChanged: proc(id: cint, value: cstring): void {.cdecl.},
    onComboChanged: proc(id: cint, selected_index: cint): void {.cdecl.} ,
    onNumericValueChanged: proc(id: cint, value: cfloat): void {.cdecl.},
    onBooleanValueChanged: proc(id: cint, value: bool): void {.cdecl.},
    onMultipleNumericValuesChanged: proc(id: cint, values: pointer, num_values: cint): void {.cdecl.},
    onClick: proc(id: cint): void {.cdecl.}
    ) {.importc, dynlib: ffiLib.}

proc onInit(): void {.cdecl.} =
    echo "Callback: Initialized"

proc onTextChanged(id: cint, value: cstring): void {.cdecl.} =
    if value != nil:
        echo "Callback: onTextChanged (id: ", id, ", value: '", value, "')"
    else:
        echo "Callback: onTextChanged received a nil value"

proc onComboChanged(id: cint, selected_index: cint): void {.cdecl.} =
    echo "Callback: onComboChanged (id: ", id, ", selected_index: ", selected_index, ")"

proc onNumericValueChanged(id: cint, value: cfloat): void {.cdecl.} =
    echo "Callback: onNumericValueChanged (id: ", id, ", value: ", value, ")"

proc onBooleanValueChanged(id: cint, value: bool): void {.cdecl.} =
    echo "Callback: onBooleanValueChanged (id: ", id, ", value: ", value, ")"

proc onMultipleNumericValuesChanged(id: cint, values: pointer, num_values: cint): void {.cdecl.} =
    if values == nil or num_values <= 0:
        echo "Callback: onMultipleNumericValuesChanged received invalid values (nil or empty)"
        return
    let floatValues = cast[ptr array[0..num_values-1, cfloat]](values)
    echo "Callback: onMultipleNumericValuesChanged (id: ", id, ", num_values: ", num_values, ", values: ["
    for i in 0 ..< num_values:
        echo "  ", floatValues[i]
    echo "])"

proc onClick(id: cint): void {.cdecl.} =
    echo "Callback: onClick (id: ", id, ")"

init(
    baseAssetsPath.cstring(),
    fontDefsJson.cstring(),
    theme2Json.cstring(),
    onInit,
    onTextChanged,
    onComboChanged,
    onNumericValueChanged,
    onBooleanValueChanged,
    onMultipleNumericValuesChanged,
    onClick
)

```

We mapped C strings (`const char*`) to [cstring](https://nim-lang.org/docs/system.html#cstring) and used the `{.cdecl.}` pragma to specify that the procedures should use the C calling convention.

Resources:

- [Source code](https://github.com/xframes-project/xframes-nim)
- [Foreign function interface](https://nim-lang.org/docs/manual.html#foreign-function-interface)

### Ruby

When you're writing Ruby code you usually don't think about memory management. However, when you're leveraging FFI, even though you're still developing in Ruby, you have to begin thinking more about these low-level issues.

Ruby has the concept of object references and garbage collection. In contrast C libraries have pointers and manual allocation and deallocation of memory. So you have to take care, that objects which provide memory referenced by a pointer, stays valid until the pointer is no longer used by the library. Therefore you have to keep references to these objects, even when they are no longer used by your ruby code.

A pointer on C level to a Ruby object is not considered an object reference by the Ruby runtime and is therefore not sufficient to protect the object from being garbage collected.

```ruby showLineNumbers
require 'ffi'

module XFrames
  extend FFI::Library
  if RUBY_PLATFORM =~ /win32|mingw|cygwin/
    ffi_lib './xframesshared.dll'
  else
    ffi_lib './libxframesshared.so'
  end

  callback :OnInitCb, [:pointer], :void
  callback :OnTextChangedCb, [:int, :string], :void
  callback :OnComboChangedCb, [:int, :int], :void
  callback :OnNumericValueChangedCb, [:int, :float], :void
  callback :OnBooleanValueChangedCb, [:int, :int], :void
  callback :OnMultipleNumericValuesChangedCb, [:int, :pointer, :int], :void
  callback :OnClickCb, [:int], :void

  attach_function :init, [
    :string,
    :string,
    :string,
    :OnInitCb,
    :OnTextChangedCb,
    :OnComboChangedCb,
    :OnNumericValueChangedCb,
    :OnBooleanValueChangedCb,
    :OnMultipleNumericValuesChangedCb,
    :OnClickCb
  ], :void
end

on_init = FFI::Function.new(:void, []) do
  puts "initialized"
end

on_text_changed = FFI::Function.new(:void, [:int, :string]) do |id, text|
  puts "Text changed: ID=#{id}, Text=#{text}"
end

on_combo_changed = FFI::Function.new(:void, [:int, :int]) do |id, selected_index|
  puts "Combo changed: ID=#{id}, Selected=#{selected_index}"
end

on_numeric_value_changed = FFI::Function.new(:void, [:int, :float]) do |id, value|
  puts "Numeric value changed: ID=#{id}, Value=#{value}"
end

on_boolean_value_changed = FFI::Function.new(:void, [:int, :int]) do |id, state|
  puts "Boolean value changed: ID=#{id}, State=#{state}"
end

on_multiple_numeric_values_changed = FFI::Function.new(:void, [:int, :pointer, :int]) do |id, values_ptr, num_values|
  float_array = values_ptr.read_array_of_float(num_values)

  puts "Multiple numeric values changed: ID=#{id}, Values=#{float_array.inspect}"
end

on_click = FFI::Function.new(:void, [:int]) do |id|
  puts "Button clicked: ID=#{id}"
end

assets_base_path = './assets'

XFrames.init(
  assets_base_path,
  font_defs_json,
  theme_json,
  on_init,
  on_text_changed,
  on_combo_changed,
  on_numeric_value_changed,
  on_boolean_value_changed,
  on_multiple_numeric_values_changed,
  on_click
)
```

Resources:

- [Source code](https://github.com/xframes-project/xframes-ruby)
- [Ruby FFI Wiki](https://github.com/ffi/ffi/wiki)
- [Ruby FFI core concepts](https://github.com/ffi/ffi/wiki/Core-Concepts)

### Crystal

When using FFI in Crystal, it's important to:

- Keep track of objects that are referenced by pointers passed to C code to prevent them from being garbage collected too early.
- Be aware that Crystal's GC doesn't automatically manage memory outside of its runtime.
- Use appropriate memory management techniques to ensure stability when working with external libraries.

```crystal showLineNumbers
alias OnInitCb = Proc(Void)
alias OnTextChangedCb = Proc(Int32, Pointer(LibC::Char), Void)
alias OnComboChangedCb = Proc(Int32, Int32, Nil)
alias OnNumericValueChangedCb = Proc(Int32, Float32, Void)
alias OnBooleanValueChangedCb = Proc(Int32, Bool, Void)
alias OnMultipleNumericValuesChangedCb = Proc(Int32, Pointer(Float32), Int32, Void)
alias OnClickCb = Proc(Int32, Void)

@[Link("xframesshared")]
lib XFrames
    fun init(
        assetsBasePath : Pointer(LibC::Char),
        rawFontDefinitions : Pointer(LibC::Char),
        rawStyleOverrideDefinitions : Pointer(LibC::Char),
        onInit : OnInitCb,
        onTextChanged : OnTextChangedCb,
        onComboChanged : OnComboChangedCb,
        onNumericValueChanged : OnNumericValueChangedCb,
        onBooleanValueChanged : OnBooleanValueChangedCb,
        onMultipleNumericValuesChanged : OnMultipleNumericValuesChangedCb,
        onClick : OnClickCb
    ) : Nil
end

onInit = ->() {
    puts "Initialized"
}
# double-check this logic
onTextChanged = ->(id : Int32, value : Pointer(LibC::Char)) do
  if value.null?
    puts "Text changed: ID=#{id}, Value is null"
  else
    crystal_string = value.to_s
    puts "Text changed: ID=#{id}, Value=#{crystal_string}"
  end
end
onComboChanged = ->(id : Int32, selected_index : Int32) {  }
onNumericValueChanged = ->(id : Int32, value : Float32) {  }
onBooleanValueChanged = ->(id : Int32, value : Bool) {  }
# double-check this logic
onMultipleNumericValuesChanged = ->(id : Int32, values: Pointer(Float32), num_values : Int32) do
  # Check if the pointer is null before accessing it
  if values.null?
    puts "Text changed: ID=#{id}, Values pointer is null"
  else
    (does this actually work?)
    slice = values.to_slice(num_values)

    # Convert the Slice to an Array
    float_array = slice.to_a

    # Output the array
    puts "Text changed: ID=#{id}, Values=#{float_array.inspect}"
  end
end
onClick = ->(id : Int32) { puts "Clicked" }

XFrames.init(
  "./assets",
  font_defs_json,
  theme2_json,
  onInit,
  onTextChanged,
  onComboChanged,
  onNumericValueChanged,
  onBooleanValueChanged,
  onMultipleNumericValuesChanged,
  onClick
)

```

Resources:

- [Source code](https://github.com/xframes-project/xframes-crystal)
- [C bindings](https://crystal-lang.org/reference/1.14/syntax_and_semantics/c_bindings/index.html)

### D

When using FFI in [D](https://dlang.org/), it's important to:

- Manually manage the memory for any D objects that are passed as pointers to external C libraries to avoid premature garbage collection.
- Be aware that D's garbage collection system won't track memory that's allocated outside of the D runtime (e.g., memory allocated via C functions).
- Explicitly mark objects as scope or retain references where necessary to ensure they aren't collected while still in use by C code.

```d showLineNumbers
import std.stdio;
import std.string : toStringz;
import std.conv;

extern(C) {
	alias OnInitCb = void function();
	alias OnTextChangedCb = void function(int, const(char)*);
	alias OnComboChangedCb = void function(int, int);
	alias OnNumericValueChangedCb = void function(int, float);
	alias OnBooleanValueChangedCb = void function(int, bool);
	alias OnMultipleNumericValuesChangedCb = void function(int, const(float)*, int);
	alias OnClickCb = void function(int);

	void init(
        const(char)* assetsBasePath,
        const(char)* rawFontDefinitions,
        const(char)* rawStyleOverrideDefinitions,
        OnInitCb onInit,
        OnTextChangedCb onTextChanged,
        OnComboChangedCb onComboChanged,
        OnNumericValueChangedCb onNumericValueChanged,
        OnBooleanValueChangedCb onBooleanValueChanged,
        OnMultipleNumericValuesChangedCb onMultipleNumericValuesChanged,
        OnClickCb onClick
    );
}

version(Linux) {
    pragma(lib, "xframesshared.so");
}

version(Windows) {
    pragma(lib, "xframesshared.lib");
}

extern(C) void onInitCallback() {
    writeln("Initialization complete!");
}

extern(C) void onTextChangedCallback(int id, const(char)* value) {
    writeln("Text changed: ", value);
}

extern(C) void onComboChangedCallback(int id, int value) {
    writeln("Combo changed: ", value);
}

extern(C) void onNumericValueChangedCallback(int id, float value) {
    writeln("Numeric value changed: ", value);
}

extern(C) void onBooleanValueChangedCallback(int id, bool value) {
    writeln("Boolean value changed: ", value);
}

extern(C) void onMultipleNumericValuesChangedCallback(int id, const(float)* values, int numValues) {
    writeln("Multiple numeric values changed: ");
    foreach (i; 0 .. numValues) {
        writeln(values[i]);
    }
}

extern(C) void onClickCallback(int id) {
    writeln("Button clicked: ", id);
}

void main()
{
    string assetsBasePath = "./assets";
    string rawFontDefinitions = fontDefsJson;
    string rawStyleOverrideDefinitions = themeJson;

	init(
        assetsBasePath.toStringz,
        rawFontDefinitions.toStringz,
        rawStyleOverrideDefinitions.toStringz,
        &onInitCallback,
        &onTextChangedCallback,
        &onComboChangedCallback,
        &onNumericValueChangedCallback,
        &onBooleanValueChangedCallback,
        &onMultipleNumericValuesChangedCallback,
        &onClickCallback
    );
}
```

We are passing C strings using [std.string.toStringz](https://dlang.org/library/std/string/to_stringz.html) and we are passing function pointers using the `&` symbol.

Resources:

- [Source code](https://github.com/xframes-project/xframes-dlang)
- [Interfacing to C](https://dlang.org/spec/interfaceToC.html)

### Haskell

[Haskell](https://www.haskell.org/) uses garbage collection for most objects but requires explicit management for FFI and foreign pointers. Foreign pointers passed to C functions must remain valid throughout the FFI call. The garbage collector does not manage memory allocated via C functions, so memory must be deallocated when no longer needed. `mallocForeignPtr` can be used to allocate memory whereas `freeHaskellFunctionPtr` can be used to release it.

```haskell showLineNumbers
{-# LANGUAGE DeriveGeneric #-}
{-# LANGUAGE OverloadedStrings #-}
{-# LANGUAGE ForeignFunctionInterface #-}

module Main where

import qualified Data.ByteString.Lazy.Char8 as BS
import Foreign
import Foreign.C
import Foreign.Ptr ()

foreign import ccall "wrapper"
  wrapOnInitCb :: (IO ()) -> IO (FunPtr (IO ()))
foreign import ccall "wrapper"
  wrapOnTextChangedCb :: (CInt -> CString -> IO ()) -> IO (FunPtr (CInt -> CString -> IO ()))
foreign import ccall "wrapper"
  wrapOnComboChangedCb :: (CInt -> CInt -> IO ()) -> IO (FunPtr (CInt -> CInt -> IO ()))
foreign import ccall "wrapper"
  wrapOnNumericValueChangedCb :: (CInt -> CFloat -> IO ()) -> IO (FunPtr (CInt -> CFloat -> IO ()))
foreign import ccall "wrapper"
  wrapOnBooleanValueChangedCb :: (CInt -> CBool -> IO ()) -> IO (FunPtr (CInt -> CBool -> IO ()))
foreign import ccall "wrapper"
  wrapOnMultipleNumericValuesChangedCb :: (CInt -> Ptr CFloat -> CInt -> IO ()) -> IO (FunPtr (CInt -> Ptr CFloat -> CInt -> IO ()))
foreign import ccall "wrapper"
  wrapOnClickCb :: (CInt -> IO ()) -> IO (FunPtr (CInt -> IO ()))


type OnInitCb = FunPtr (IO ())
type OnTextChangedCb = FunPtr (CInt -> CString -> IO ())
type OnComboChangedCb = FunPtr (CInt -> CInt -> IO ())
type OnNumericValueChangedCb = FunPtr (CInt -> CFloat -> IO ())
type OnBooleanValueChangedCb = FunPtr (CInt -> CBool -> IO ())
type OnMultipleNumericValuesChangedCb = FunPtr (CInt -> Ptr CFloat -> CInt -> IO ())
type OnClickCb = FunPtr (CInt -> IO ())

foreign import ccall "init"
    c_init :: CString
           -> CString
           -> CString
           -> OnInitCb
           -> OnTextChangedCb
           -> OnComboChangedCb
           -> OnNumericValueChangedCb
           -> OnBooleanValueChangedCb
           -> OnMultipleNumericValuesChangedCb
           -> OnClickCb
           -> IO ()

onInit :: IO ()
onInit = putStrLn "Initialized"

onTextChanged :: CInt -> CString -> IO ()
onTextChanged index cstr = do
    text <- peekCString cstr
    putStrLn $ "Text Changed at index " ++ show index ++ ": " ++ text

onComboChanged :: CInt -> CInt -> IO ()
onComboChanged index value =
    putStrLn $ "Combo Changed at index " ++ show index ++ " with value " ++ show value

onNumericValueChanged :: CInt -> CFloat -> IO ()
onNumericValueChanged index value =
    putStrLn $ "Numeric Value Changed at index " ++ show index ++ " with value " ++ show (realToFrac value :: Float)

onBooleanValueChanged :: CInt -> CBool -> IO ()
onBooleanValueChanged index value =
    putStrLn $ "Boolean Value Changed at index " ++ show index ++ " with value " ++ show (fromCBool value)

onMultipleNumericValuesChanged :: CInt -> Ptr CFloat -> CInt -> IO ()
onMultipleNumericValuesChanged index ptr count = do
    values <- peekArray (fromIntegral count) ptr
    putStrLn $ "Multiple Numeric Values Changed at index " ++ show index ++
               " with values " ++ show (map realToFrac values :: [Float])

onClick :: CInt -> IO ()
onClick index = putStrLn $ "Clicked at index " ++ show index

main :: IO ()
main = runInBoundThread $ do
    assetsBasePath <- newCString "./assets"
    rawFontDefs <- newCString fontDefsJson
    rawStyleDefs <- newCString theme2Json

    onInitPtr <- wrapOnInitCb onInit
    onTextChangedPtr <- wrapOnTextChangedCb onTextChanged
    onComboChangedPtr <- wrapOnComboChangedCb onComboChanged
    onNumericValueChangedPtr <- wrapOnNumericValueChangedCb onNumericValueChanged
    onBooleanValueChangedPtr <- wrapOnBooleanValueChangedCb onBooleanValueChanged
    onMultipleNumericValuesChangedPtr <- wrapOnMultipleNumericValuesChangedCb onMultipleNumericValuesChanged
    onClickPtr <- wrapOnClickCb onClick

    c_init assetsBasePath rawFontDefs rawStyleDefs
                  onInitPtr
                  onTextChangedPtr
                  onComboChangedPtr
                  onNumericValueChangedPtr
                  onBooleanValueChangedPtr
                  onMultipleNumericValuesChangedPtr
                  onClickPtr

    putStrLn "Press enter to exit application"
    _ <- getLine
    putStrLn $ "Exiting..."

    freeHaskellFunPtr onInitPtr
    freeHaskellFunPtr onTextChangedPtr
    freeHaskellFunPtr onComboChangedPtr
    freeHaskellFunPtr onNumericValueChangedPtr
    freeHaskellFunPtr onBooleanValueChangedPtr
    freeHaskellFunPtr onMultipleNumericValuesChangedPtr
    freeHaskellFunPtr onClickPtr
```

Function pointers are created using special `"wrapper"` functions (see lines 12-25). Such pointers must be freed using `freeHaskellFunPtr` (see lines 97-103). It is paramount to use `runInBoundThread` to guarantee thread-safety of the callbacks. `newCString` is used to convert strings as required.

Sources

- [Source code](https://github.com/xframes-project/xframes-haskell)
- [Exposing Haskell functions](https://www.haskell.org/definition/ffi/sec-entry.html)
- [Using the FFI](https://wiki.haskell.org/GHC/Using_the_FFI)
- [Foreign function interface (FFI)](https://ghc.gitlab.haskell.org/ghc/doc/users_guide/exts/ffi.html)
- [Foreign Function Interface](https://wiki.haskell.org/Foreign_Function_Interface)

## Conclusions

FFI represents a powerful technique for bridging programming languages, allowing developers to leverage high-performance libraries across diverse language ecosystems. The XFrames project demonstrates both the **tremendous potential** and **inherent challenges** of cross-language development.

### Key Insights

- FFI enables seamless integration of C and C++ libraries into multiple programming languages.
- Developers must carefully navigate complex interoperability challenges.
- JSON serialization can provide a pragmatic approach to managing data exchange.
- Careful design of interface layers can mitigate potential performance overhead.

### Future Considerations

- Expanding FFI support across more languages and platforms.
- Developing more robust techniques for handling memory and type translations.

The journey of implementing XFrames across languages underscores that while FFI is not a magical solution, it offers a compelling pathway for creating flexible, high-performance cross-language applications.

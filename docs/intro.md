---
sidebar_position: 1
---

# What is XFrames?

Imagine the flexibility and ease of React, without the web’s typical overhead. This library is built for developers who want the freedom to create high-performance native desktop applications using JavaScript, but without the resource-intensive DOM, CSS, or Electron. You’ll be working closer to the metal with OpenGL and GLFW3 (or WebAssembly and WebGPU on the browser), giving you unparalleled control over performance and memory usage.

## Getting Started

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 16.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## Generate a new Node.js desktop application

```bash
npx create-xframes-node-app
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run your XFrames app.

Enter a project name, cd into the newly created project folder then run

```bash
npm start
```

## Generate a new WASM-enabled, Webpack-based web application

Detailed instructions are coming soon! Meanwhile, please refer to [this example](https://github.com/andreamancuso/xframes/tree/main/packages/dear-imgui/examples/cra-example).


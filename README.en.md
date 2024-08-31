<p align='center'>
  <img src='./img/logo.png' width='400'/>
</p>

<p align='center'>Clones Vue.js to implement a basic MVVM framework</p>

<p align='center'>
    <a href='https://vuelite-demo.vercel.app'>
        <img src="https://img.shields.io/badge/deploy-Vuelite Demo-blue" />
    </a>
    <a href=''>
        <img src="https://img.shields.io/badge/CDN-Active-brightgreen" />
    </a>
    <a href='https://www.npmjs.com/package/vue-lite-js'>
        <img src="https://img.shields.io/npm/v/vue-lite-js" />
    </a>
</p>

<p align='center'>
   <a href='./README.md'>한국어</a> | <strong>English ✅</strong>
</p>


## 🌐 Translation Notice

This document has been translated using an **automated translation tool** and has been reviewed for accuracy. However, as a non-native English speaker, there may be limitations in the translation. The nuances and content I intended to convey might differ slightly from the original document. For the most accurate information, please refer to the [original document](./README.md). Please be aware that there might be issues or misunderstandings due to translation.


## 🚀 Introduction

Inspired by modern frameworks that use the `MVVM (Model-View-ViewModel)` pattern to support efficient data binding and user interface management, this is a basic `MVVM` framework cloned from `Vue.js`, offering similar functionality and syntax.  <br />

The primary goal of this repository is to clone the core functionality of `Vue.js`, while applying the `MVVM` pattern and core observer patterns. The overall structure of the project is based on the code referenced in [#Reference](#-reference). Although complex issues are not considered, this project is intended to help in understanding two-way data binding and the fundamental principles of `Vue.js`.


## 🎉 Getting Started

- #### Using npm
To install `vuelite` from `npm` and use it in your project, run the following command:

```sh
npm install vue-lite-js@latest
```

- #### Using cdn
To use `vuelite` directly in the browser, include the script via a `cdn` as shown below:
```html
<script src="https://unpkg.com/vue-lite-js@latest"></script>
```

- #### Local Development
If you want to modify the source code and test it directly in a development environment, follow these steps:

##### Clone the repository
```sh
git clone https://github.com/Heonys/vue-lite-js 
```
##### Install dependencies
```sh
npm install 
```
##### Start the development server
```sh
npm run start 
```

##### Write markdown and scripts for testing
```sh
📦 vuelite 
├── 📂 dev 
│    ├── 📄 index.html ✅
│    └── 📄 index.ts ✅
├── 📂 src ✅
│    ├── 📂 core
│    ├── 📂 types
│    ... 
```
You can modify the source code in the `src` folder and write markdown and scripts in the `dev` folder.


## 💡Basic usage

<p style="text-align: center;">
  <img src="./img/Animation.gif" alt="Description of GIF" />
  <br />
  <sapn>CDN Demo: </sapn>
  <a href='https://vuelite-demo.vercel.app' target="_blank">https://vuelite-demo.vercel.app</a>
</p>

```html
<div id="app">
  <input type="text" v-model="message" />
  <p v-style="textStyle">{{ message }}</p>
  <button v-on:click="handleClick">change vuelite</button>
  <div>
    <input type="checkbox" v-model="checked" />
    <span>{{ isChecked }}</span>
  </div>
</div>
```
```ts
import Vuelite from "vue-lite-js";

new Vuelite({
  el: "#app",
  data() {
    return {
      message : "",
      checked: true,
      textStyle: { color: "#FF0000" },
    }
  },
  methods: {
    handleClick() {
      this.message  = "vuelite";
    },
  },
  computed: {
    isChecked() {
      return this.checked ? "checked" : "unchecked";
    },
  }
})
```

## ✨ Details 

>1. It primarily clones the **Option API** approach of `Vue.js` and supports its core functionalities, but does not include all features.
>2. While the `template` property is supported, there is no support for loaders like `.vue` files in `Vue.js`, so you need to write markup directly in `HTML` files. This makes it closer to a library than a traditional framework.
>3. Since it does not support single-file component formats, it includes a `styles` property in options to handle `<style>` blocks.
>4. To simplify style and class binding, it supports the `v-style` and `v-class` directives.



## 🧩 Overview

<p align="center">
  <img src="./img/diagram.png" alt="Description of diagram" />
</p>


## ⭐ Workflow

### 1. Creating a ViewModel
```ts
class Vuelite {
  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;
    injectReactive(this);
    injectStyleSheet(this);
    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);
  }
}
```
In the `MVVM` pattern, creating a `viewmodel` involves initializing a `vue` instance with an `options` object to provide `DOM` and data binding. This serves as the entry point for setting up the view model.

> **Key Ideas for Implementing ViewModel**
>1. Inject reactivity into the data received through the options object to detect changes.
>2. Traverse the DOM to parse directives and create observers.
>3. Achieve two-way binding through interactions between reactive data and observers.


### 2. Injecting Reactivity

<p align="center">
  <img src="./img/diagram2.png" alt="Description of diagram" />
</p>

```ts
// target: The original object to be wrapped
// handler: An object containing methods, called 'traps', that intercept operations
new Proxy(target, handler);
```

The [Proxy](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Proxy) object is a wrapper around the original object that controls access to it and allows for interception of specific actions to add new functionalities.

Since our goal is to detect changes in the data and achieve two-way binding with the actual view (DOM), we need to consider how to detect changes in data. In JavaScript, this can be achieved using `Object.defineProperty`, which allows dynamic registration of `getter` and `setter` methods on object properties, along with `Proxy`.

> In `Vue2`, reactive data is implemented using `defineProperty`, while `Vue3` uses `Proxy` for this purpose.

Therefore, we will wrap all `data` properties of the `viewmodel` with a `Proxy`, adding `get traps` and `set traps` to detect changes in all properties.


```ts
const handler = {
  get(target: Target, key: string, receiver: Target) {
    // 1. get trap (getter)
  },
  set(target: Target, key: string, value: any, receiver: Target) {
    // 2. set trap (setter)
  },
};
new Proxy(data, handler);
```

However, at the current stage of creating the `Proxy`, explaining `getter` and `setter` might be somewhat challenging. It's important to note that these are traps that operate when accessing or modifying the properties. Although they are crucial for the core logic, at this stage, you can simply understand that `getter` and `setter` are registered to inject `Reactivity`.

1) **Get Trap**
The `get` trap is responsible for creating a [Dep](#dep-object-creation) object and linking it with the currently active [Observer](#5-observer-creation). During the parsing of directives in the `Scanner` and creation of the `Observer`, a `getter` is triggered when finding the `expression` corresponding to the directive in the `vm`. Consequently, a `Dep` associated with this `expression` is created, establishing a link with the newly created `Observer`.

2) **Set Trap**
Since the `get` trap has already been executed when the `Observer` is created, the `set` trap is always mapped to the corresponding `Dep` for the relevant `key`. The occurrence of a `setter` signifies a change in the property's value. The `set` trap then calls `notify` to send a notification to all `Observers` subscribed to the corresponding `Dep`, informing them that the property they are dependent on has changed and prompting them to `update`.


#### Dep Object Creation
The `Dep` object stands for `Dependency` and plays a role in detecting changes in data and notifying the subscribed `Observer`s. Although a `Dep` object is created for every data property when the `Proxy` is initialized, it indicates that every reactive data has its corresponding `Dep`. The `Dep` instance itself does not maintain the state of the mapped reactive data. This is because the `define` method of `Reactivity` internally maps `keys` to `Dep` objects using a structure named `deps`. When the `setter` is triggered, it accesses the `deps` in the closure to identify the mapped `key`. Therefore, the `Dep` itself does not hold the state of the key it is mapped to but can perform `notify` operations.


```ts
class Dep {
  static activated: Observer
  //...
}
```
The `activated` property is a `static` variable that holds the current active observer and is used to establish the dependency relationship between `Dep` and `Observer`. It acts like a global variable for tracking the active observer.


#### Injecting `computed` and `methods`
```ts
injectMethod(vm);
injectComputed(vm);
```

Unlike `data`, which requires reactivity for data binding to the `DOM`, `computed` properties and `methods` do not need to be reactive. Therefore, they can be registered as properties of the `viewmodel` so that they can be accessed accordingly. The key point is to explicitly bind `this` so that when `computed` or `method` functions use `this`, it correctly refers to the `viewmodel`.


### 3. Directive and Template Parsing
```ts
const scanner = new VueScanner(new NodeVisitor());
scanner.scan(this);
```

From the `el` property provided in the options, we traverse all child nodes to inspect for any `v-` prefixed directive attributes or template syntax `{{ }}` used in text nodes. The reason for traversing nodes at the `Node` level rather than the `DOM` level is to ensure that text nodes are examined for template parsing. <br />

To handle node traversal, the actual traversal role is delegated to a `Visitor`, while specific actions for each node are processed by the `Scanner`. This separation ensures that `Visitor` and `Scanner` handle distinct responsibilities.


```ts
const action = (node: Node) => {
  isReactiveNode(node) && new Observable(vm, node);
};
```
As we traverse all nodes, we check whether each node has directives or template syntax in its text and create `Observable` instances accordingly. <br />

Here, `Observable` simply checks whether the node is a directive with the `v-` prefix or a template, creating `Directive` objects as needed. Template bindings are converted to `v-text` directives. Except for `v-on`, which handles event registration, all other directives receive an `updater` as an argument. This is used to create `Observer` instances uniformly for directives like `v-bind`.


### 4. v-model Binding

The `v-model` directive in `Vue.js` simplifies the implementation of two-way data binding, allowing user inputs to automatically synchronize with the data in the `vue` instance. This directive is used for UI elements that receive user input, such as `input`, `textarea`, and `select` elements. <br /> 


```html
<!-- wo-way binding using v-model -->
<div>
  <input type="text" v-model="title">
  <div>{{ title }}</div>
</div>`;

<!-- One-way binding + Event Handler -->
<div>
  <input 
    type="text" 
    v-bind:value="title" 
    v-on:input="handleInput"
  >
  <div>{{ title }}</div>
</div>
```

In practice, `v-model` operates similarly to the combination of `v-bind` and `v-on:event` shown in the code above. `vuelite` supports both of these methods for two-way data binding.


```html
<input type="checkbox" v-model="isChecked">

<input type="radio" name="gender" value="male" v-model="selectedOption">
<input type="radio" name="gender" value="female" v-model="selectedOption">

<select v-model="selectedRadio">
  <option value="javascript">javascript</option>
  <option value="python">python</option>
</select>
```

When implementing `v-model`, the challenge is that each element has different binding values such as `value`, `checked`, etc., and even for the same `checked` property, `checkbox` and `radio` buttons operate differently. Additionally, events can vary, such as `change` and `input`, which necessitates a consistent approach to accessing and binding element values or states. <br />

Therefore, when handling `v-model` in the `Directive` class, it's important to manage these elements or types consistently by implementing branching logic to register the appropriate `updater` and event listeners.



### 5. Observer Creation

```ts
bind(updater?: Updater) {
  // ... 
  const value = evaluateValue(this.vm, this.exp);
  updater && updater(this.node, value);
  new Observer(this.vm, this.exp, (value) => {
    updater && updater(this.node, value);
  });
```

The type of `updater` is determined based on the type of directive, which ultimately leads to the creation of an `Observer`. 

In this context, an `updater` refers to a specific update function that is triggered when a change occurs in a property with `Reactive` injected, and the `set trap` calls `notify`. This function notifies all `Observers` subscribed to the corresponding `dep` that a change has occurred and requests them to update. In other words, an `Observer` responds to changes by updating the `DOM`, ensuring that changes in the `viewmodel`'s `data` are eventually reflected on the screen. <br /> 

Before creating an `Observer`, the `updater` is executed once to reflect the `viewmodel`'s properties onto the `DOM` during the initial rendering.


#### Relationship between Observer and Dep

They have a many-to-many relationship, where each manages a collection of the other. <br />

From the perspective of `Dep`, it manages multiple `Observers` because several directives can use the same property. Conversely, an `Observer` can depend on multiple `Deps` because a single directive can rely on multiple reactive data sources.

> The data passed through options results in the creation of a `Dep` that maps 1:1 with each piece of data. Similarly, each directive creates an `Observer` that maps 1:1 with itself. Think of them as interacting with each other through this 1:1 mapping.


#### getterTrigger

```ts
// Observer
getterTrigger() {
  Dep.activated = this;
  const value = evaluateValue(this.vm, this.exp);
  Dep.activated = null;
  return value;
}
// Dep 
depend() {
    Dep.activated?.addDep(this);
}
```

The `Observer` class has a method called `getterTrigger`, which may seem to simply retrieve the property from `vm`, but it serves a more crucial role.

>1. Initially, it is used as a trigger to intentionally cause the `get trap` on the proxy objects wrapping all `data` properties in the `Reactivity` class.
>2. Before the `get trap` occurs, it sets `Dep.activated` to the current `this`, meaning the current `Observer`, and when the `get trap` happens, it calls `dep.depend()` to establish the relationship between the currently activated `Observer` and the `Dep`.

As a result, `getterTrigger` plays a key role by triggering the `get trap` of reactive data, creating `Dep` objects, and simultaneously establishing the relationship between these `Dep` objects and `Observer`.

> - #### In summary:
> `Observer` subscribes to `Dep` and waits, while `Dep` is monitored by `Observer`. When `Dep` detects a change, it notifies all subscribed `Observers` of the update.


## 📖 Reference
- [DMQ/mvvm](https://github.com/DMQ/mvvm)
- [bowencool/bue](https://github.com/bowencool/bue)

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vuelite = factory());
})(this, (function () { 'use strict';

    function extractPath(obj, path) {
        path = path.trim();
        return path.split(".").reduce((target, key) => {
            if (target && Object.hasOwn(target, key))
                return target[key];
            return null;
        }, obj);
    }
    function isValidInteger(str) {
        return /^\d+$/.test(str);
    }
    function assignPath(obj, path, value) {
        path = path.trim();
        let target = obj;
        const splited = path.split(/[.[\]]/).filter(Boolean);
        splited.forEach((key, index, arr) => {
            if (index === arr.length - 1) {
                target[key] = value;
            }
            else if (isValidInteger(key)) {
                if (!Array.isArray(target))
                    return;
                target = target[+key];
            }
            else {
                if (!Object.hasOwn(target, key))
                    return;
                target = target[key];
            }
        });
    }
    function createDOMTemplate(template) {
        if (!template)
            return;
        const div = document.createElement("div");
        div.innerHTML = template;
        return div.firstElementChild;
    }
    const isNonObserver = (name, modifier) => {
        return name.startsWith("else") || (name === "bind" && modifier === "key");
    };
    function isDeferred(key) {
        return key === "if" || key === "for";
    }

    function typeOf(value) {
        return Object.prototype.toString
            .call(value)
            .slice(8, -1)
            .toLowerCase();
    }
    const isObject = (data) => {
        return typeOf(data) === "object" || typeOf(data) === "array";
    };
    function isQuotedString(str) {
        const regex = /^["'].*["']$/;
        return regex.test(str) && str[0] === str[str.length - 1];
    }
    const isElementNode = (node) => {
        return node.nodeType === 1;
    };
    const isTextNode = (node) => {
        return node.nodeType === 3;
    };
    const isIncludeText = (node) => {
        const attrs = node === null || node === void 0 ? void 0 : node.attributes;
        if (!attrs)
            return;
        return Array.from(attrs).some((v) => v.name === "v-text");
    };
    function extractKeywords(str) {
        const regexIn = /^(.+?)\s+in\s+(.+)$/;
        const regexOf = /^(.+?)\s+of\s+(.+)$/;
        let match = str.match(regexIn);
        if (match) {
            return { key: match[1], list: match[2] };
        }
        match = str.match(regexOf);
        if (match) {
            return { key: match[1], list: match[2] };
        }
        return null;
    }
    function extractAlias(str) {
        const match = str.match(/\(([^)]+)\)/);
        if (!match)
            return [str];
        const variables = match[1]
            .split(",")
            .map((item) => item.trim())
            .filter((item) => item);
        return variables;
    }
    function isPrimitive(value) {
        return value !== Object(value);
    }

    class Dep {
        constructor(key) {
            this.key = key;
            this.listener = new Set();
        }
        subscribe(observer) {
            this.listener.add(observer);
        }
        unsubscribe(observer) {
            this.listener.delete(observer);
        }
        notify() {
            this.listener.forEach((observer) => {
                observer.update();
            });
        }
        depend() {
            var _a;
            (_a = Dep.activated) === null || _a === void 0 ? void 0 : _a.addDep(this);
        }
    }
    Dep.activated = null;
    class Store {
        static getStore() {
            return this.globalDeps;
        }
        static addStore(deps) {
            this.globalDeps.push(deps);
        }
        static forceUpdate() {
            this.globalDeps.forEach((deps) => {
                for (const dep of deps.values()) {
                    dep.notify();
                }
            });
        }
    }
    Store.globalDeps = [];

    function isAccessor(data) {
        if (typeof data !== "function")
            return true;
        return false;
    }

    class Reactivity {
        constructor(data) {
            this.proxy = this.define(data);
        }
        define(data) {
            const me = this;
            const caches = new Map();
            const deps = new Map();
            Store.addStore(deps);
            const handler = {
                get(target, key, receiver) {
                    if (typeOf(key) === "symbol")
                        return Reflect.get(target, key, receiver);
                    if (!deps.has(key))
                        deps.set(key, new Dep(key));
                    deps.get(key).depend();
                    const child = target[key];
                    if (isObject(child)) {
                        if (!caches.has(key))
                            caches.set(key, me.define(child));
                        return caches.get(key);
                    }
                    return Reflect.get(target, key, receiver);
                },
                set(target, key, value, receiver) {
                    const oldLength = target._length;
                    const result = Reflect.set(target, key, value, receiver);
                    const newLength = target._length;
                    if (oldLength !== newLength && deps.has("_length")) {
                        deps.get("_length").notify();
                    }
                    if (deps.has(key)) {
                        deps.get(key).notify();
                    }
                    return result;
                },
            };
            return new Proxy(data, handler);
        }
    }
    function injectReactive(vm) {
        const { data } = vm.options;
        const returned = typeof data === "function" ? data() : {};
        const proxy = new Reactivity(returned).proxy;
        for (const key in returned) {
            Object.defineProperty(vm, key, {
                configurable: false,
                get: () => proxy[key],
                set: (value) => {
                    proxy[key] = value;
                },
            });
        }
        injectMethod(vm);
        injectComputed(vm);
    }
    function injectMethod(vm) {
        const { methods } = vm.options;
        if (!methods)
            return;
        Object.entries(methods).forEach(([key, method]) => {
            if (Object.hasOwn(vm, key))
                throw new Error(`${key} has already been declared`);
            Object.defineProperty(vm, key, {
                value: (...args) => method.apply(vm, args),
            });
        });
    }
    function injectComputed(vm) {
        const { computed } = vm.options;
        if (!computed)
            return;
        for (const key in computed) {
            if (Object.hasOwn(vm, key))
                throw new Error(`${key} has already been declared`);
        }
        Object.entries(computed).forEach(([key, value]) => {
            const descripter = {};
            if (isAccessor(value)) {
                descripter.get = value.get.bind(vm);
                descripter.set = (...params) => {
                    value.set.apply(vm, params);
                };
            }
            else {
                descripter.get = () => value.call(vm);
            }
            Object.defineProperty(vm, key, descripter);
        });
    }

    class StyleRule {
        constructor(sheet) {
            const len = sheet.cssRules.length;
            sheet.insertRule("*{}", len);
            this.rule = sheet.cssRules[len];
        }
        selector(selector) {
            this.rule.selectorText = selector;
        }
        setStyle(key, value) {
            this.rule.style[key] = value;
        }
    }
    function injectStyleSheet(vm) {
        const { styles } = vm.options;
        if (!styles)
            return;
        const styleElement = document.createElement("style");
        document.head.appendChild(styleElement);
        Object.entries(styles).forEach(([selector, styles]) => {
            const rule = new StyleRule(styleElement.sheet);
            rule.selector(selector);
            Object.entries(styles).forEach(([key, value]) => {
                rule.setStyle(key, value);
            });
        });
    }

    const directiveNames = [
        "bind",
        "model",
        "text",
        "style",
        "class",
        "html",
        "on",
        "if",
        "show",
        "for",
    ];

    function extractDirective(attr) {
        if (isShortcut(attr)) {
            if (attr.slice(0, 1) === ":") {
                return { key: "bind", modifier: attr.slice(1) };
            }
            else {
                return { key: "on", modifier: attr.slice(1) };
            }
        }
        else {
            const regExp = /^v-([\w-]+)(:(\w+))?$/;
            const match = attr.match(regExp);
            return { key: match[1], modifier: match[3] || null };
        }
    }
    function extractTemplate(text) {
        const regExp = /{{\s*(.*?)\s*}}/g;
        const matched = [];
        let match;
        while ((match = regExp.exec(text)) !== null) {
            matched.push(match[1]);
        }
        return matched;
    }
    function isShortcut(name) {
        return [":", "@"].includes(name[0]);
    }
    function isDirective(attr) {
        return attr.startsWith("v-") || attr.startsWith(":") || attr.startsWith("@");
    }
    function isEventDirective(name) {
        return name.startsWith("v-on:") || name.startsWith("@");
    }
    const isReactiveNode = (node) => {
        if (isElementNode(node)) {
            const attributes = node.attributes;
            return Array.from(attributes).some((attr) => isDirective(attr.name));
        }
        else if (isTextNode(node)) {
            const textContent = node.textContent || "";
            return extractTemplate(textContent).length > 0 ? true : false;
        }
    };
    const isValidDirective = (name) => {
        return directiveNames.includes(name);
    };
    function shouldSkipChildren(node) {
        return node instanceof HTMLElement && node.hasAttribute("v-for");
    }
    function removeLoopDirective(el) {
        el.removeAttribute("v-for");
        el.removeAttribute(":key");
        el.removeAttribute("v-bind:key");
    }

    const updaters = {
        text(node, value) {
            node.textContent = value;
        },
        class(el, value) {
            if (isObject(value)) {
                Object.entries(value).forEach(([k, v]) => {
                    if (v)
                        el.classList.add(k);
                });
            }
        },
        style(el, value) {
            for (const [k, v] of Object.entries(value)) {
                if (isQuotedString(v)) {
                    el.style[k] = v.slice(1, -1);
                }
                else {
                    el.style[k] = v;
                }
            }
        },
        html(el, value) {
            el.innerHTML = value;
        },
        inputCheckbox(el, value) {
            el.checked = value;
        },
        inputRadio(el, value) {
            el.checked = el.value === value;
        },
        inputValue(el, value) {
            el.value = value;
        },
        inputMultiple(el, value) {
            const options = Array.from(el.options);
            if (!Array.isArray(value))
                return;
            options.forEach((option) => {
                option.selected = value.includes(option.value);
            });
        },
        customBind(el, value) {
            value && el.setAttribute(this.modifier, value);
        },
        objectBind(el, value) {
            if (isObject(value)) {
                Object.entries(value).forEach(([k, v]) => el.setAttribute(k, v));
            }
        },
        show(el, condition) {
            if (condition)
                el.style.display = "";
            else
                el.style.display = "none";
        },
    };

    function unsafeEvaluate(context, expression) {
        try {
            const fn = new Function(`
      with (this) {
        return ${expression};
      }
    `);
            return fn.call(context);
        }
        catch (error) {
            return undefined;
        }
    }
    function evaluateTemplate(vm, exp) {
        const templates = extractTemplate(exp);
        const evaluatedValues = templates.reduce((acc, template) => {
            acc[template] = unsafeEvaluate(vm, template);
            return acc;
        }, {});
        const result = exp.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
            return evaluatedValues[key] || "";
        });
        return result;
    }
    function evaluateValue(name, vm, exp) {
        switch (name) {
            case "text": {
                return evaluateTemplate(vm, exp);
            }
            default: {
                return unsafeEvaluate(vm, exp);
            }
        }
    }

    class Observer {
        constructor(vm, exp, directiveName, onUpdate) {
            this.vm = vm;
            this.exp = exp;
            this.directiveName = directiveName;
            this.onUpdate = onUpdate;
            this.deps = new Set();
            this.value = this.getterTrigger();
            onUpdate(this.value);
        }
        addDep(dep) {
            dep.subscribe(this);
            this.deps.add(dep);
        }
        getterTrigger() {
            Dep.activated = this;
            const value = evaluateValue(this.directiveName, this.vm, this.exp);
            if (isObject(value))
                value._length;
            Dep.activated = null;
            return value;
        }
        update() {
            const oldValue = this.value;
            const newValue = this.getterTrigger();
            if (isPrimitive(newValue) && oldValue === newValue)
                return;
            this.value = newValue;
            this.onUpdate.call(this.vm, newValue);
        }
    }

    class Condition {
        constructor(vm, el, exp) {
            this.vm = vm;
            this.el = el;
            this.exp = exp;
            this.parent = el.parentElement || vm.el;
            this.childIndex = Array.from(this.parent.children).indexOf(el);
            this.ifFragment = document.createDocumentFragment();
            this.checkForElse();
            this.render();
        }
        render() {
            new Observer(this.vm, this.exp, "if", (value) => {
                this.updater(value);
            });
        }
        checkForElse() {
            const silbling = this.el.nextElementSibling;
            if (silbling === null || silbling === void 0 ? void 0 : silbling.hasAttribute("v-else")) {
                this.elseElement = silbling;
                this.elseFragment = document.createDocumentFragment();
            }
        }
        updater(value) {
            if (value) {
                const ref = this.parent.children[this.childIndex];
                this.parent.insertBefore(this.ifFragment, ref);
                if (this.elseElement)
                    this.elseFragment.appendChild(this.elseElement);
            }
            else {
                this.ifFragment.appendChild(this.el);
                if (this.elseElement) {
                    const ref = this.parent.children[this.childIndex];
                    this.parent.insertBefore(this.elseFragment, ref);
                }
            }
        }
    }

    class NodeVisitor {
        visit(action, target) {
            let current;
            const stack = [target.firstChild];
            while ((current = stack.pop())) {
                if (current) {
                    if (shouldSkipChildren(current)) {
                        action(current);
                        if (current.nextSibling)
                            stack.push(current.nextSibling);
                        continue;
                    }
                    action(current);
                    if (current.firstChild)
                        stack.push(current.firstChild);
                    if (current.nextSibling)
                        stack.push(current.nextSibling);
                }
            }
        }
    }

    function createContext(alias, exp, index, data) {
        if (typeOf(data) === "object") {
            const key = Object.keys(data)[index];
            switch (alias.length) {
                case 1: {
                    return { [alias[0]]: `${exp}.${key}` };
                }
                case 2: {
                    return { [alias[0]]: `${exp}.${key}`, [alias[1]]: `"${key}"` };
                }
                case 3: {
                    return {
                        [alias[0]]: `${exp}.${key}`,
                        [alias[1]]: `"${key}"`,
                        [alias[2]]: index,
                    };
                }
                default: {
                    return {};
                }
            }
        }
        else if (typeOf(data) === "number") {
            switch (alias.length) {
                case 1: {
                    return { [alias[0]]: index + 1 };
                }
                case 2: {
                    return { [alias[0]]: index + 1, [alias[1]]: index };
                }
                default: {
                    return {};
                }
            }
        }
        else {
            switch (alias.length) {
                case 1: {
                    return { [alias[0]]: `${exp}[${index}]` };
                }
                case 2: {
                    return { [alias[0]]: `${exp}[${index}]`, [alias[1]]: index };
                }
                default: {
                    return {};
                }
            }
        }
    }
    function loopSize(value) {
        switch (typeOf(value)) {
            case "string":
            case "array": {
                return value.length;
            }
            case "object": {
                return Object.values(value).length;
            }
            case "number": {
                return Math.max(0, Number(value));
            }
            default: {
                return 0;
            }
        }
    }
    function replaceAlias(context, expression) {
        if (!context)
            return expression;
        Object.keys(context).forEach((alias) => {
            const pattern = new RegExp(`\\b${alias}\\b`, "g");
            expression = expression.replace(pattern, context[alias]);
        });
        return expression;
    }

    class Context {
        constructor(loop, data) {
            this.loop = loop;
            this.data = data;
            this.scanner = new VueScanner(new NodeVisitor());
        }
        bind(el, index) {
            const { alias, vm, loopEffects, listExp, parentContext } = this.loop;
            const context = { ...parentContext, ...createContext(alias, listExp, index, this.data) };
            Vuelite.context = context;
            const container = this.scanner.scanPartial(vm, el, loopEffects);
            Vuelite.context = null;
            return container;
        }
    }

    class ForLoop {
        constructor(vm, el, exp, parentContext) {
            this.vm = vm;
            this.el = el;
            this.exp = exp;
            this.parentContext = parentContext;
            this.loopEffects = [];
            this.parent = el.parentElement || vm.el;
            this.startIndex = Array.from(this.parent.children).indexOf(el);
            const keywords = extractKeywords(this.exp);
            if (!keywords)
                return;
            const { key, list } = keywords;
            this.listExp = list;
            this.alias = extractAlias(key);
            this.render();
        }
        render() {
            new Observer(this.vm, this.listExp, "for", (value) => {
                this.updater(value);
            });
        }
        updater(value) {
            const fragment = document.createDocumentFragment();
            const length = loopSize(value);
            const endPoint = this.startIndex + length - 1;
            const context = new Context(this, value);
            Array.from({ length }).forEach((_, index) => {
                const clone = this.el.cloneNode(true);
                removeLoopDirective(clone);
                const boundEl = context.bind(clone, index);
                fragment.appendChild(boundEl);
            });
            if (this.el.isConnected) {
                this.parent.replaceChild(fragment, this.el);
                this.endIndex = endPoint;
            }
            else {
                for (let i = this.endIndex; i >= this.startIndex; i--) {
                    const child = this.parent.children[i];
                    if (child) {
                        this.parent.removeChild(child);
                    }
                }
                this.el.remove();
                const ref = this.parent.children[this.startIndex];
                this.parent.insertBefore(fragment, ref);
                this.endIndex = this.startIndex + length - 1;
            }
            this.clearEffects();
        }
        clearEffects() {
            this.loopEffects.forEach((fn) => fn());
            this.loopEffects = [];
        }
    }

    class Directive {
        constructor(name, vm, node, exp, loopEffects) {
            this.vm = vm;
            this.node = node;
            this.exp = exp;
            const { key, modifier } = extractDirective(name);
            this.directiveName = key;
            this.modifier = modifier;
            if (!isValidDirective(key))
                return;
            if (isNonObserver(key, modifier))
                return;
            if (isDeferred(key)) {
                this.scheduleTask(key, loopEffects);
            }
            else {
                if (isEventDirective(name))
                    this.on();
                else
                    this[key]();
                if (node instanceof HTMLElement)
                    node.removeAttribute(name);
            }
        }
        bind(updater) {
            updater = this.selectUpdater(updater);
            new Observer(this.vm, this.exp, this.directiveName, (value) => {
                updater(this.node, value);
            });
        }
        model() {
            const el = this.node;
            switch (el.tagName) {
                case "INPUT": {
                    const input = el;
                    if (input.type === "checkbox") {
                        input.addEventListener("change", (event) => {
                            const value = event.target.checked;
                            assignPath(this.vm, this.exp, value);
                        });
                        this.bind(updaters.inputCheckbox);
                    }
                    else if (input.type === "radio") {
                        input.name = this.exp;
                        input.addEventListener("change", (event) => {
                            const value = event.target.value;
                            assignPath(this.vm, this.exp, value);
                        });
                        this.bind(updaters.inputRadio);
                    }
                    else {
                        input.addEventListener("input", (event) => {
                            const value = event.target.value;
                            assignPath(this.vm, this.exp, value);
                        });
                        this.bind(updaters.inputValue);
                    }
                    break;
                }
                case "TEXTAREA": {
                    el.addEventListener("input", (event) => {
                        const value = event.target.value;
                        assignPath(this.vm, this.exp, value);
                    });
                    this.bind(updaters.inputValue);
                    break;
                }
                case "SELECT": {
                    const select = el;
                    if (select.multiple) {
                        select.addEventListener("change", (event) => {
                            const target = event.target;
                            const selectedValues = Array.from(target.selectedOptions).map((option) => option.value);
                            assignPath(this.vm, this.exp, selectedValues);
                        });
                        this.bind(updaters.inputMultiple);
                    }
                    else {
                        select.addEventListener("change", (event) => {
                            const value = event.target.value;
                            assignPath(this.vm, this.exp, value);
                        });
                        this.bind(updaters.inputValue);
                    }
                    break;
                }
                default: {
                    throw new Error(`Unsupported element type: ${el.tagName}`);
                }
            }
        }
        text() {
            this.bind(updaters.text.bind(this));
        }
        style() {
            this.bind(updaters.style);
        }
        class() {
            this.bind(updaters.class);
        }
        html() {
            this.bind(updaters.html);
        }
        show() {
            this.bind(updaters.show);
        }
        on() {
            const fn = extractPath(this.vm, this.exp);
            if (typeof fn === "function") {
                this.node.addEventListener(this.modifier, fn);
            }
            else {
                const unsafeFn = unsafeEvaluate(this.vm, `function(){ ${this.exp} }`);
                this.node.addEventListener(this.modifier, unsafeFn);
            }
        }
        scheduleTask(key, task) {
            const context = { ...Vuelite.context };
            const constructor = key === "if" ? Condition : ForLoop;
            const directiveFn = () => {
                return new constructor(this.vm, this.node, this.exp, context);
            };
            if (task)
                task.push(directiveFn);
            else
                this.vm.deferredTasks.push(directiveFn);
        }
        selectUpdater(updater) {
            const mod = this.modifier;
            if (mod === "text" || mod === "class" || mod === "style") {
                return updaters[mod].bind(this);
            }
            if (updater)
                return updater;
            else
                return mod ? updaters.customBind.bind(this) : updaters.objectBind.bind(this);
        }
    }

    class Observable {
        constructor(vm, node, loopEffects) {
            this.vm = vm;
            this.node = node;
            this.loopEffects = loopEffects;
            const patten = /{{\s*(.*?)\s*}}/;
            const text = node.textContent;
            if (isElementNode(node)) {
                this.directiveBind(node);
            }
            else if (isTextNode(node) && patten.test(text) && !isIncludeText(node.parentElement)) {
                this.templateBind(node);
            }
        }
        directiveBind(el) {
            Array.from(el.attributes).forEach(({ name, value }) => {
                if (isDirective(name)) {
                    const global = Vuelite.context;
                    value = replaceAlias(global, value);
                    new Directive(name, this.vm, el, value, this.loopEffects);
                }
            });
        }
        templateBind(node) {
            let exp = node.textContent;
            const global = Vuelite.context;
            exp = replaceAlias(global, exp);
            new Directive("v-text", this.vm, node, exp);
        }
    }

    class Scanner {
        constructor(visitor) {
            this.visitor = visitor;
        }
        visit(action, target) {
            this.visitor.visit(action, target);
        }
    }
    class VueScanner extends Scanner {
        node2Fragment(el) {
            const fragment = document.createDocumentFragment();
            let child;
            while ((child = el.firstChild))
                fragment.appendChild(child);
            return fragment;
        }
        scan(vm) {
            const action = (node) => {
                isReactiveNode(node) && new Observable(vm, node);
            };
            if (vm.template) {
                this.fragment = this.node2Fragment(vm.template);
                vm.el.innerHTML = "";
            }
            else {
                this.fragment = this.node2Fragment(vm.el);
            }
            action(this.fragment);
            this.visit(action, this.fragment);
            vm.el.appendChild(this.fragment);
            vm.clearTasks();
        }
        scanPartial(vm, el, loopEffects) {
            const container = this.node2Fragment(el);
            const action = (node) => {
                isReactiveNode(node) && new Observable(vm, node, loopEffects);
            };
            action(container);
            this.visit(action, container);
            el.appendChild(container);
            return el;
        }
    }

    class Vuelite {
        constructor(options) {
            this.deferredTasks = [];
            this.el = document.querySelector(options.el);
            this.options = options;
            this.template = createDOMTemplate(options.template);
            injectReactive(this);
            injectStyleSheet(this);
            const scanner = new VueScanner(new NodeVisitor());
            scanner.scan(this);
        }
        clearTasks() {
            this.deferredTasks.forEach((fn) => fn());
            this.deferredTasks = [];
        }
    }

    return Vuelite;

}));

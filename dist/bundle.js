(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vuelite = factory());
})(this, (function () { 'use strict';

    function isObjectFormat(str) {
        const regex = /^\{(\s*[a-zA-Z_$][a-zA-Z_$0-9]*\s*:\s*[^{}]+\s*,?\s*)+\}$/;
        return regex.test(str);
    }
    function isFunctionFormat(str) {
        const regex = /^\s*(\w+(\.\w+)*)\(\)\s*$/;
        const match = str.match(regex);
        return match ? match[1] : null;
    }
    function typeOf(value) {
        return Object.prototype.toString
            .call(value)
            .slice(8, -1)
            .toLowerCase();
    }
    const isObject = (data) => {
        return typeOf(data) === "object";
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

    function extractPath(obj, path) {
        path = path.trim();
        return path.split(".").reduce((target, key) => {
            if (target && Object.hasOwn(target, key))
                return target[key];
            return null;
        }, obj);
    }
    function assignPath(obj, path, value) {
        path = path.trim();
        let target = obj;
        path.split(".").forEach((key, index, arr) => {
            if (index === arr.length - 1)
                target[key] = value;
            else {
                if (!Object.hasOwn(target, key))
                    return;
                target = target[key];
            }
        });
    }
    function normalizeToJson(str) {
        return str
            .replace(/(\w+):/g, '"$1":')
            .replace(/:\s*([^,\s{}]+)/g, (match, p1) => {
            if (/^".*"$/.test(p1))
                return match;
            return `: "${p1}"`;
        });
    }
    function evaluateBoolean(str) {
        return str === "true" ? true : str === "false" ? false : str;
    }
    function evaluateValue(vm, exp) {
        let result;
        if (isObjectFormat(exp)) {
            const json = JSON.parse(normalizeToJson(exp));
            result = Object.entries(json).reduce((acc, [key, value]) => {
                if (isQuotedString(value)) {
                    acc[key] = evaluateBoolean(value.slice(1, -1));
                }
                else {
                    acc[key] = extractPath(vm, value);
                }
                return acc;
            }, json);
        }
        else {
            const match = isFunctionFormat(exp);
            result = match ? extractPath(vm, match).call(vm) : extractPath(vm, exp);
        }
        return result;
    }
    function createDOMTemplate(template) {
        if (!template)
            return;
        const div = document.createElement("div");
        div.innerHTML = template;
        return div.firstElementChild;
    }

    class Dep {
        constructor() {
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
            const handler = {
                get(target, key, receiver) {
                    if (!deps.has(key))
                        deps.set(key, new Dep());
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
                    const result = Reflect.set(target, key, value, receiver);
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

    function extractDirective(attr) {
        const regExp = /^v-(\w+)(:(\w+))?$/;
        const match = attr.match(regExp);
        return { key: match[1], modifier: match[3] || null };
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
    function isContainsTemplate(str) {
        const regex = /{{\s*[^{}\s]+\s*}}/;
        return regex.test(str);
    }
    function isDirective(attr) {
        return attr.indexOf("v-") === 0;
    }
    function isEventDirective(dir) {
        return dir.indexOf("v-on") === 0;
    }
    const isReactiveNode = (node) => {
        if (isElementNode(node)) {
            const attributes = node.attributes;
            return Array.from(attributes).some((attr) => isDirective(attr.name));
        }
        else if (isTextNode(node)) {
            const textContent = node.textContent || "";
            return extractTemplate(textContent) ? true : false;
        }
    };
    function escapeParentheses(string) {
        return string.replace(/[()]/g, "\\$&");
    }
    const replaceTemplate = (template, key, value) => {
        const regex = new RegExp(`{{\\s*${escapeParentheses(key)}\\s*}}`, "g");
        return template.replace(regex, value);
    };

    const updaters = {
        text(node, value) {
            if (isContainsTemplate(this.template)) {
                node.textContent = replaceTemplate(this.template, this.exp, value);
            }
            else {
                node.textContent = value;
            }
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
            el.setAttribute(this.modifier, value);
        },
        objectBind(el, value) {
            if (isObject(value)) {
                Object.entries(value).forEach(([k, v]) => el.setAttribute(k, v));
            }
        },
    };

    class Observer {
        constructor(vm, exp, onUpdate) {
            this.vm = vm;
            this.exp = exp;
            this.onUpdate = onUpdate;
            this.deps = new Set();
            this.value = this.getterTrigger();
        }
        addDep(dep) {
            dep.subscribe(this);
            this.deps.add(dep);
        }
        getterTrigger() {
            Dep.activated = this;
            const value = evaluateValue(this.vm, this.exp);
            Dep.activated = null;
            return value;
        }
        update() {
            const oldValue = this.value;
            const newValue = this.getterTrigger();
            if (oldValue !== newValue) {
                this.value = newValue;
                this.onUpdate.call(this.vm, newValue);
            }
        }
    }

    class Directive {
        constructor(name, vm, node, exp) {
            this.vm = vm;
            this.node = node;
            this.exp = exp;
            const { key, modifier } = extractDirective(name);
            this.modifier = modifier;
            this.template = node.textContent;
            if (isEventDirective(name))
                this.eventHandler();
            else
                this[key]();
            if (node instanceof HTMLElement)
                node.removeAttribute(name);
        }
        bind(updater) {
            const mod = this.modifier;
            if (mod === "text" || mod === "class" || mod === "style") {
                updater = updaters[mod].bind(this);
            }
            if (!updater) {
                updater = mod ? updaters.customBind.bind(this) : updaters.objectBind.bind(this);
            }
            const value = evaluateValue(this.vm, this.exp);
            updater && updater(this.node, value);
            new Observer(this.vm, this.exp, (value) => {
                updater && updater(this.node, value);
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
        eventHandler() {
            const fn = extractPath(this.vm, this.exp);
            if (typeof fn === "function")
                this.node.addEventListener(this.modifier, fn);
        }
    }

    class Observable {
        constructor(vm, node) {
            this.vm = vm;
            this.node = node;
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
                    new Directive(name, this.vm, el, value);
                }
            });
        }
        templateBind(node) {
            extractTemplate(node.textContent).forEach((value) => {
                new Directive("v-text", this.vm, node, value);
            });
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
            this.fragment = fragment;
        }
        scan(vm) {
            const action = (node) => {
                isReactiveNode(node) && new Observable(vm, node);
            };
            if (vm.template) {
                this.node2Fragment(vm.template);
                vm.el.innerHTML = "";
            }
            else {
                this.node2Fragment(vm.el);
            }
            action(this.fragment);
            this.visit(action, this.fragment);
            vm.el.appendChild(this.fragment);
        }
    }

    class NodeVisitor {
        visit(action, target) {
            let current;
            const stack = [target.firstChild];
            while ((current = stack.pop())) {
                if (current) {
                    action(current);
                    if (current.firstChild)
                        stack.push(current.firstChild);
                    if (current.nextSibling)
                        stack.push(current.nextSibling);
                }
            }
        }
    }

    class Vuelite {
        constructor(options) {
            this.el = document.querySelector(options.el);
            this.options = options;
            this.template = createDOMTemplate(options.template);
            injectReactive(this);
            injectStyleSheet(this);
            const scanner = new VueScanner(new NodeVisitor());
            scanner.scan(this);
        }
    }

    return Vuelite;

}));
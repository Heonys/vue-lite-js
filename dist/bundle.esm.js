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
function node2Fragment(el) {
    const fragment = document.createDocumentFragment();
    let child;
    while ((child = el.firstChild))
        fragment.appendChild(child);
    return fragment;
}
function isReserved(str) {
    return str.charCodeAt(0) === 0x24;
}
function initializeProps(props) {
    return props.reduce((acc, cur) => {
        acc[cur] = undefined;
        return acc;
    }, {});
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
const isFunction = (data) => {
    return typeOf(data) === "function";
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
const hasTextDirective = (node) => {
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
function hasTemplate(str) {
    const pattern = /{{\s*[^{}]+\s*}}/;
    return pattern.test(str);
}
function isNonStandard(node) {
    if (!(node instanceof HTMLElement))
        return;
    return node.tagName.includes("-");
}
function isComponent(node) {
    return node instanceof HTMLElement && node.isComponent;
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
            if (!observer.isMethods)
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
function isWatchMethod(value) {
    return typeOf(value) === "function";
}

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
    static addObserver(observer) {
        this.globalObservers.push(observer);
    }
    static updateMethods() {
        this.globalObservers.forEach((obs) => {
            if (obs.isMethods)
                obs.update();
        });
    }
}
Store.globalDeps = [];
Store.globalObservers = [];

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
            deleteProperty(target, property) {
                const oldLength = target._length;
                const result = Reflect.deleteProperty(target, property);
                const newLength = target._length;
                if (oldLength !== newLength && deps.has("_length")) {
                    deps.get("_length").notify();
                }
                return result;
            },
        };
        return new Proxy(data, handler);
    }
}
function injectReactive(vm) {
    const { data, props } = vm.$options;
    const returned = isFunction(data) ? data() : {};
    const proxy = new Reactivity(returned).proxy;
    Object.defineProperty(vm, "$data", { get: () => proxy });
    for (const key in returned) {
        if (!isReserved(key)) {
            Object.defineProperty(vm, key, {
                configurable: false,
                get: () => proxy[key],
                set: (value) => {
                    proxy[key] = value;
                },
            });
        }
    }
    if (props) {
        const propsState = initializeProps(props);
        const proxyProps = new Reactivity(propsState).proxy;
        Object.defineProperty(vm, "$props", { get: () => proxyProps });
        for (const key in propsState) {
            Object.defineProperty(vm, key, {
                configurable: false,
                get: () => proxyProps[key],
                set: (_) => { },
            });
        }
    }
    injectMethod(vm);
    injectComputed(vm);
}
function injectMethod(vm) {
    const { methods } = vm.$options;
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
    const { computed } = vm.$options;
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
function createStyleSheet(vm) {
    const { styles } = vm.$options;
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
const isReactiveNode = (vm, node) => {
    if (isElementNode(node)) {
        const attributes = node.attributes;
        const ref = attributes.getNamedItem("ref");
        if (ref)
            vm.$refs[ref.value] = node;
        return Array.from(attributes).some((attr) => isDirective(attr.name));
    }
    else if (isTextNode(node)) {
        const textContent = node.textContent || "";
        return extractTemplate(textContent).length > 0;
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
        if (isMethodsFormat(template))
            Dep.activated.isMethods = true;
        acc[template] = unsafeEvaluate(vm, template);
        return acc;
    }, {});
    const result = exp.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
        return evaluatedValues[key] || "";
    });
    return result;
}
function evaluateValue(vm, exp) {
    if (hasTemplate(exp)) {
        return evaluateTemplate(vm, exp);
    }
    else {
        return unsafeEvaluate(vm, exp);
    }
}
function isMethodsFormat(str) {
    return str.slice(-2) === "()";
}

class Observer {
    constructor(vm, exp, onUpdate, watchOption) {
        var _a;
        this.vm = vm;
        this.exp = exp;
        this.onUpdate = onUpdate;
        this.deps = new Set();
        this.isMethods = false;
        Store.addObserver(this);
        this.value = this.getterTrigger();
        if (watchOption) {
            const immediate = (_a = watchOption.immediate) !== null && _a !== void 0 ? _a : false;
            immediate && onUpdate(this.value);
        }
        else {
            onUpdate(this.value);
        }
    }
    addDep(dep) {
        dep.subscribe(this);
        this.deps.add(dep);
    }
    getterTrigger() {
        Dep.activated = this;
        const value = evaluateValue(this.vm, this.exp);
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
        this.isMethods
            ? this.onUpdate(newValue, oldValue)
            : this.vm.updateQueue.push(() => this.onUpdate(newValue, oldValue));
    }
}
function createWatcher(vm) {
    const { watch } = vm.$options;
    if (!watch)
        return;
    Object.entries(watch).forEach(([key, value]) => {
        if (isWatchMethod(value)) {
            new Observer(vm, key, value, { immediate: false });
        }
        else {
            const { handler, ...options } = value;
            new Observer(vm, key, handler, options);
        }
    });
}

class Condition {
    constructor(vm, el, exp) {
        this.vm = vm;
        this.el = el;
        this.exp = exp;
        this.parent = el.parentElement || vm.$el;
        this.childIndex = Array.from(this.parent.children).indexOf(el);
        this.ifFragment = document.createDocumentFragment();
        this.checkForElse();
        this.render();
    }
    render() {
        new Observer(this.vm, this.exp, (newVal, oldVal) => {
            this.updater(newVal);
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
        Vuelite$1.context = context;
        const container = this.scanner.scanPartial(vm, el, loopEffects);
        Vuelite$1.context = null;
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
        this.parent = el.parentElement || vm.$el;
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
        new Observer(this.vm, this.listExp, (newVal, oldVal) => {
            this.updater(newVal);
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
        this.name = key;
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
        new Observer(this.vm, this.exp, (newVal, oldVal) => {
            if (isComponent(this.node)) {
                const childVM = Vuelite$1.globalComponents[this.node.tagName];
                childVM.$parent = this.vm;
                childVM.$props[this.modifier] = newVal;
            }
            else {
                updater(this.node, newVal);
            }
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
        const context = { ...Vuelite$1.context };
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
        if (isElementNode(node)) {
            this.directiveBind(node);
        }
        else if (isTextNode(node) &&
            hasTemplate(node.textContent) &&
            !hasTextDirective(node.parentElement)) {
            this.templateBind(node);
        }
    }
    directiveBind(el) {
        Array.from(el.attributes).forEach(({ name, value }) => {
            if (isDirective(name)) {
                const global = Vuelite$1.context;
                value = replaceAlias(global, value);
                new Directive(name, this.vm, el, value, this.loopEffects);
            }
        });
    }
    templateBind(node) {
        let exp = node.textContent;
        const global = Vuelite$1.context;
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
    scan(vm) {
        const action = (node) => {
            var _a;
            if (isNonStandard(node)) {
                const tagName = node.tagName;
                const ref = Vuelite$1.globalComponents[tagName].$el;
                (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(ref, node);
                node.isComponent = true;
            }
            isReactiveNode(vm, node) && new Observable(vm, node);
        };
        this.fragment = node2Fragment(vm.$el);
        action(this.fragment);
        this.visit(action, this.fragment);
        vm.$el.appendChild(this.fragment);
        vm.clearTasks();
    }
    scanPartial(vm, el, loopEffects) {
        const container = node2Fragment(el);
        const action = (node) => {
            isReactiveNode(vm, node) && new Observable(vm, node, loopEffects);
        };
        action(container);
        this.visit(action, container);
        el.appendChild(container);
        return el;
    }
}

class Lifecycle {
    constructor() {
        this.deferredTasks = [];
    }
    setHooks(options) {
        this.hooks = options;
    }
    callHook(name) {
        const method = this.hooks[name];
        if (typeOf(method) === "function") {
            name === "beforeCreate" ? method.call(null) : method.call(this);
        }
    }
    clearTasks() {
        this.deferredTasks.forEach((fn) => fn());
        this.deferredTasks = [];
    }
}

class Vuelite extends Lifecycle {
    constructor(options) {
        super();
        this.$props = {};
        this.$parent = null;
        this.$refs = {};
        this.updateQueue = [];
        this.$options = options;
        this.setHooks(this.$options);
        this.setupDOM(options);
        this.callHook("beforeCreate");
        injectReactive(this);
        createStyleSheet(this);
        createWatcher(this);
        this.callHook("created");
        const scanner = new VueScanner(new NodeVisitor());
        scanner.scan(this);
        this.callHook("mounted");
        requestAnimationFrame(() => this.render());
    }
    setupDOM(options) {
        if (options.template) {
            this.$el = createDOMTemplate(options.template);
        }
        else {
            const el = document.querySelector(options.el);
            if (el instanceof HTMLTemplateElement) {
                this.$el = el.content.firstElementChild;
            }
            else {
                this.$el = el;
            }
        }
    }
    render() {
        if (this.updateQueue.length > 0) {
            this.callHook("beforeUpdate");
            while (this.updateQueue.length > 0) {
                const fn = this.updateQueue.shift();
                if (typeOf(fn) === "function")
                    fn();
            }
            Store.updateMethods();
            this.callHook("updated");
        }
        requestAnimationFrame(() => this.render());
    }
    $watch(source, callback, options) {
        new Observer(this, source, callback, options);
    }
    $forceUpdate() {
        Store.forceUpdate();
    }
    static component(name, options) {
        this.globalComponents[name.toLocaleUpperCase()] = new Vuelite(options);
    }
}
Vuelite.globalComponents = {};
var Vuelite$1 = Vuelite;

export { Vuelite$1 as default };

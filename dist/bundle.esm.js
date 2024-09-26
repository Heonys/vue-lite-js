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
        acc[cur] = null;
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
const isPlainObject = (data) => {
    return typeOf(data) === "object";
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
const hasDirectiveBy = (name, node) => {
    const attrs = node === null || node === void 0 ? void 0 : node.attributes;
    if (!attrs)
        return;
    return Array.from(attrs).some((v) => v.name === name);
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
    const pattern = /{{\s*.*?\s*}}/;
    return pattern.test(str);
}
function isMethodsFormat(str) {
    return str.slice(-2) === "()";
}
function isNonStandard(node) {
    if (!(node instanceof HTMLElement))
        return;
    return node.tagName.includes("-");
}
function isComponent(node) {
    return node instanceof HTMLElement && node.isComponent;
}
function isTemplateElement(el) {
    return el instanceof HTMLTemplateElement;
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
                const result = Reflect.get(target, key, receiver);
                if (typeOf(key) === "symbol")
                    return result;
                if (!deps.has(key))
                    deps.set(key, new Dep());
                deps.get(key).depend();
                const child = target[key];
                if (isObject(child)) {
                    if (!caches.has(key))
                        caches.set(key, me.define(child));
                    return caches.get(key);
                }
                return result;
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
    const { styles, scopedStyles } = vm.$options;
    if (!styles && !scopedStyles)
        return;
    if (styles) {
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
    if (scopedStyles) {
        const scopedStyleElement = document.createElement("style");
        document.head.appendChild(scopedStyleElement);
        const scopeId = generateScopeId();
        Object.entries(scopedStyles).forEach(([selector, style]) => {
            const scopedSelector = `${selector}[data-scopeid="${scopeId}"], *[data-scopeid="${scopeId}"] ${selector}`;
            const rule = new StyleRule(scopedStyleElement.sheet);
            rule.selector(scopedSelector);
            Object.entries(style).forEach(([key, value]) => {
                rule.setStyle(key, value);
            });
        });
        if (vm.$el instanceof HTMLElement) {
            vm.$el.setAttribute("data-scopeid", scopeId);
        }
        else if (vm.$el instanceof DocumentFragment) {
            Array.from(vm.$el.children).forEach((v) => {
                v.setAttribute("data-scopeid", scopeId);
            });
        }
    }
}
function generateScopeId() {
    return "v-" + Math.random().toString(36).substring(2, 7);
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
function checkObserverType(vm, node) {
    if (isComponent(node))
        return "Component";
    if (isElementNode(node)) {
        const attributes = node.attributes;
        const ref = attributes.getNamedItem("ref");
        if (ref)
            vm.$refs[ref.value] = node;
        if (Array.from(attributes).some((attr) => isDirective(attr.name)))
            return "Directive";
    }
    else if (isTextNode(node) &&
        hasTemplate(node.textContent) &&
        !hasDirectiveBy("v-text", node.parentElement)) {
        const textContent = node.textContent || "";
        if (extractTemplate(textContent).length > 0)
            return "Template";
    }
}
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
        if (value != null) {
            el.setAttribute(this.modifier, value);
        }
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
        var _a;
        return (_a = evaluatedValues[key]) !== null && _a !== void 0 ? _a : "";
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
        new Observer(this.vm, this.exp, (newVal) => {
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
        new Observer(this.vm, this.exp, (newVal) => {
            if (isComponent(this.node)) {
                const childVM = this.vm.$components.get(this.node) || Vuelite$1.globalComponents.get(this.node);
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
        if (this.vm.$props[this.exp] === null) {
            new Observer(this.vm, this.exp, (newVal) => {
                this.node.addEventListener(this.modifier, newVal);
            });
        }
        else {
            const fn = extractPath(this.vm, this.exp);
            if (typeof fn === "function") {
                this.node.addEventListener(this.modifier, fn);
            }
            else {
                const unsafeFn = unsafeEvaluate(this.vm, `function(){ ${this.exp} }`);
                this.node.addEventListener(this.modifier, unsafeFn);
            }
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
        if (this.name === "bind" && mod === "checked") {
            return updaters.inputCheckbox;
        }
        if (updater)
            return updater;
        else
            return mod ? updaters.customBind.bind(this) : updaters.objectBind.bind(this);
    }
}

class Observable {
    constructor(vm, node, type, loopEffects) {
        this.vm = vm;
        this.node = node;
        this.loopEffects = loopEffects;
        switch (type) {
            case "Component":
            case "Directive": {
                this.directiveBind(node);
                break;
            }
            case "Template": {
                this.templateBind(node);
                break;
            }
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
            if (isNonStandard(node)) {
                this.replaceComponent(vm, node);
            }
            const obserberType = checkObserverType(vm, node);
            if (obserberType)
                new Observable(vm, node, obserberType);
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
            if (isNonStandard(node)) {
                this.replaceComponent(vm, node, loopEffects);
            }
            const obserberType = checkObserverType(vm, node);
            if (obserberType)
                new Observable(vm, node, obserberType, loopEffects);
        };
        action(container);
        this.visit(action, container);
        el.appendChild(container);
        return el;
    }
    replaceComponent(vm, el, task) {
        const childVM = vm.$components.get(el) || Vuelite$1.globalComponents.get(el);
        if (childVM) {
            vm.deferredTasks.push(() => { var _a; return (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(childVM.$el, el); });
            el.isComponent = true;
        }
        else {
            const option = vm.componentsNames[el.tagName] || Vuelite$1.globalComponentsNames[el.tagName];
            if (option) {
                el.isComponent = true;
                const childVM = new Vuelite$1(option);
                if (vm.componentsNames[el.tagName]) {
                    vm.$components.set(el, childVM);
                }
                else {
                    Vuelite$1.globalComponents.set(el, childVM);
                }
                const fn = () => { var _a; return (_a = el.parentNode) === null || _a === void 0 ? void 0 : _a.replaceChild(childVM.$el, el); };
                if (task)
                    task.push(fn);
                else
                    vm.deferredTasks.push(fn);
            }
        }
    }
}

class Lifecycle {
    constructor() {
        this.deferredTasks = [];
    }
    setHooks(options) {
        this.$hooks = options;
    }
    callHook(name) {
        const method = this.$hooks[name];
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
        this.$components = new Map();
        this.componentsNames = {};
        this.updateQueue = [];
        this.$options = options;
        this.setHooks(this.$options);
        this.localComponents(options);
        this.callHook("beforeCreate");
        injectReactive(this);
        createWatcher(this);
        this.callHook("created");
        if (!this.setupDOM(options))
            return this;
        this.mount();
    }
    mount(selector) {
        this.callHook("beforeMount");
        if (selector) {
            this.$el = document.querySelector(selector);
        }
        createStyleSheet(this);
        const scanner = new VueScanner(new NodeVisitor());
        scanner.scan(this);
        this.callHook("mounted");
        requestAnimationFrame(() => this.render());
    }
    render() {
        if (this.updateQueue.length > 0) {
            this.callHook("beforeUpdate");
            while (this.updateQueue.length > 0) {
                const fn = this.updateQueue.shift();
                if (isFunction(fn))
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
    setupDOM(options) {
        if (options.template) {
            return (this.$el = createDOMTemplate(options.template));
        }
        else if (options.el) {
            const el = document.querySelector(options.el);
            if (isTemplateElement(el)) {
                return (this.$el = el.content.cloneNode(true));
            }
            else {
                return (this.$el = el);
            }
        }
        else
            return null;
    }
    localComponents(options) {
        const { components } = options;
        if (!components)
            return;
        Object.entries(components).forEach(([name, options]) => {
            this.componentsNames[name.toUpperCase()] = options;
        });
    }
    static component(name, options) {
        this.globalComponentsNames[name.toLocaleUpperCase()] = options;
    }
}
Vuelite.globalComponentsNames = {};
Vuelite.globalComponents = new Map();
var Vuelite$1 = Vuelite;

function isRef$1(value) {
    return typeOf(value) === "object" && Object.hasOwn(value, "__v_isRef");
}
function isProxy$1(value) {
    return isObject(value) && Object.hasOwn(value, "__v_isReactive");
}

const deps = new WeakMap();
const computedMap = new WeakMap();
function ref$1(value) {
    if (isPlainObject(value)) {
        value = reactive$1(value);
    }
    const trackedRef = Object.defineProperties({}, {
        value: {
            enumerable: true,
            get: () => {
                track(trackedRef, "value");
                return value;
            },
            set: (newVal) => {
                value = newVal;
                trigger(trackedRef, "value");
            },
        },
        __v_isRef: {
            value: true,
        },
        __v_exp: {
            writable: true,
            value: "",
        },
    });
    return trackedRef;
}
function reactive$1(target) {
    const handler = {
        get(target, key, receiver) {
            const result = Reflect.get(target, key, receiver);
            track(target, key);
            return result;
        },
        set(target, key, value, receiver) {
            const result = Reflect.set(target, key, value, receiver);
            trigger(target, key);
            return result;
        },
    };
    const proxy = new Proxy(target, handler);
    return Object.defineProperty(proxy, "__v_isReactive", {
        configurable: false,
        enumerable: false,
        value: true,
    });
}
function track(target, key) {
    if (!deps.has(target))
        deps.set(target, new Map());
    const depsMap = deps.get(target);
    if (!depsMap.has(key))
        depsMap.set(key, new Dep());
    const dep = depsMap.get(key);
    dep.depend();
}
function trigger(target, key) {
    const depsMap = deps.get(target);
    if (!depsMap)
        return;
    const dep = depsMap.get(key);
    dep && dep.notify();
}
function injectReactivity(vm, refs) {
    Object.entries(refs).forEach(([key, result]) => {
        if (isFunction(result)) {
            Object.defineProperty(vm, key, {
                configurable: false,
                value: (...args) => result.apply(vm, args),
            });
        }
        else if (isRef$1(result) && computedMap.has(result)) {
            result.__v_exp = key;
            const computed = computedMap.get(result);
            const descripter = {};
            if (isFunction(computed)) {
                descripter.get = () => computed.call(vm);
            }
            else {
                descripter.get = computed.get.bind(vm);
                descripter.set = (...params) => {
                    computed.set.apply(vm, params);
                };
            }
            Object.defineProperty(vm, key, descripter);
        }
        else if (isRef$1(result)) {
            result.__v_exp = key;
            Object.defineProperty(vm, key, {
                configurable: false,
                get: () => result.value,
                set: (value) => {
                    result.value = value;
                },
            });
        }
        else if (isProxy$1(result)) {
            Object.defineProperty(vm, key, {
                configurable: false,
                get: () => result,
            });
        }
    });
}
function computed$1(input) {
    if (isFunction(input)) {
        const initRef = ref$1(input(undefined));
        computedMap.set(initRef, input);
        return initRef;
    }
    else {
        const { get } = input;
        const initRef = ref$1(get(undefined));
        computedMap.set(initRef, input);
        return initRef;
    }
}

const watchMap = new WeakMap();
const wachers = new Set();
function watch$1(source, callback) {
    wachers.add(source);
    watchMap.set(source, callback);
}
function createWacher(vm) {
    wachers.forEach((watcher) => {
        new Observer(vm, watcher.__v_exp, watchMap.get(watcher));
    });
}

const hooks = {};
function onBeforeMount$1(callback) {
    hooks.beforeMount = callback;
}
function onMounted$1(callback) {
    hooks.mounted = callback;
}
function onBeforeUpdate$1(callback) {
    hooks.beforeUpdate = callback;
}
function onUpdated$1(callback) {
    hooks.updated = callback;
}
function bindHooks(vm) {
    for (const key in hooks) {
        const hookKey = key;
        vm.$hooks[hookKey] = hooks[hookKey];
    }
}

function createApp$1(options) {
    const app = new Vuelite$1(options);
    const reactive = options.setup.call(app, app.$props);
    injectReactivity(app, reactive);
    createWacher(app);
    bindHooks(app);
    return {
        ...app,
        component(name, options) {
            Vuelite$1.component(name, options);
            return this;
        },
        mount(selector) {
            app.mount(selector);
        },
    };
}

var Vue3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    bindHooks: bindHooks,
    computed: computed$1,
    createApp: createApp$1,
    isProxy: isProxy$1,
    isRef: isRef$1,
    onBeforeMount: onBeforeMount$1,
    onBeforeUpdate: onBeforeUpdate$1,
    onMounted: onMounted$1,
    onUpdated: onUpdated$1,
    reactive: reactive$1,
    ref: ref$1,
    watch: watch$1
});

Object.defineProperty(Object.prototype, "_length", {
    get: function () {
        if (Object.hasOwn(this, "length")) {
            return this.length;
        }
        else if (typeOf(this) === "object") {
            return Object.keys(this).length;
        }
        else {
            return 0;
        }
    },
    enumerable: false,
});
const { createApp, ref, reactive, computed, watch, isRef, isProxy, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, } = Vue3;

export { computed, createApp, Vuelite$1 as default, isProxy, isRef, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, reactive, ref, watch };

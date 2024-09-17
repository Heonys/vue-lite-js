type Updater = (node: Node, value: any) => void;
declare const updaters: {
    text(this: Directive, node: Node, value: string): void;
    class(el: HTMLElement, value: any): void;
    style(el: HTMLElement, value: object): void;
    html(el: HTMLElement, value: string): void;
    inputCheckbox(el: HTMLInputElement, value: any): void;
    inputRadio(el: HTMLInputElement, value: any): void;
    inputValue(el: HTMLInputElement, value: any): void;
    inputMultiple(el: HTMLSelectElement, value: any): void;
    customBind(this: Directive, el: HTMLElement, value: any): void;
    objectBind(this: Directive, el: HTMLInputElement, value: any): void;
    show(el: HTMLElement, condition: any): void;
};

type HookNames = "beforeCreate" | "created" | "mounted" | "beforeUpdate" | "updated";
declare class Lifecycle<Data, Methods, Computed> {
    deferredTasks: Function[];
    private hooks;
    setHooks(options: Options<Data, Methods, Computed>): void;
    callHook(name: HookNames): void;
    clearTasks(): void;
}

type Accessor<Data, Methods, Computed> = {
    get?(this: Vuelite<Data, Methods, Computed>): any;
    set?(this: Vuelite<Data, Methods, Computed>, value: any): void;
};
type ComputedType<Data, Methods, Computed> = {
    [K: string]: Accessor<Data, Methods, Computed> | (() => any);
};
type WatchCallback = (newVal: any, oldVal: any) => void;
type WatchOption = {
    immediate?: boolean;
};
type WatchObject = {
    [K in keyof WatchOption]: WatchOption[K];
} & {
    handler: WatchCallback;
};
type WatchType = {
    [K: string]: WatchCallback | WatchObject;
};
type Options<Data = {}, Methods = {}, Computed = {}> = {
    el: string;
    template?: string;
    data?: () => Data;
    methods?: Methods & ThisType<Data & Methods & Computed>;
    computed?: ComputedType<Data, Methods, Computed> & ThisType<Data & Methods & Computed>;
    watch?: WatchType;
    styles?: {
        [K: string]: any;
    };
} & {
    [Hook in Exclude<HookNames, "beforeCreate">]?: (this: Data & Methods & Computed) => void;
} & {
    beforeCreate?: (this: void) => void;
};
interface ComponentPublicInstance {
    $data: object;
    $el: Node | null;
    $options: Options;
    $refs: {
        [name: string]: Element | null;
    };
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
}

declare class Vuelite<D = {}, M = {}, C = {}> extends Lifecycle<D, M, C> implements ComponentPublicInstance {
    $data: object;
    $el: HTMLElement;
    template?: Element;
    $options: Options<D, M, C>;
    $refs: {
        [name: string]: Element;
    };
    updateQueue: Function[];
    static context?: Record<string, any>;
    [customKey: string]: any;
    constructor(options: Options<D, M, C>);
    render(): void;
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
}

declare class Directive {
    vm: Vuelite;
    node: Node;
    exp: any;
    name: string;
    modifier: string;
    constructor(name: string, vm: Vuelite, node: Node, exp: any, loopEffects?: Function[]);
    bind(updater?: Updater): void;
    model(): void;
    text(): void;
    style(): void;
    class(): void;
    html(): void;
    show(): void;
    on(): void;
    scheduleTask(key: string, task?: Function[]): void;
    selectUpdater(updater: Updater): Updater;
}

declare class Observable {
    vm: Vuelite;
    node: Node;
    loopEffects?: Function[];
    constructor(vm: Vuelite, node: Node, loopEffects?: Function[]);
    directiveBind(el: Element): void;
    templateBind(node: Node): void;
}

interface Visitor<T = any> {
    visit(action: Function, target: T): void;
}
declare class NodeVisitor implements Visitor {
    visit(action: (param: Node) => void, target: HTMLElement): void;
}

declare abstract class Scanner {
    private visitor;
    constructor(visitor: Visitor);
    visit(action: Function, target: any): void;
    abstract scan(target: any): void;
}
declare class VueScanner extends Scanner {
    private fragment;
    scan(vm: Vuelite): void;
    scanPartial(vm: Vuelite, el: HTMLElement, loopEffects: Function[]): HTMLElement;
}

declare class Observer {
    private vm;
    private exp;
    private onUpdate;
    private value;
    private deps;
    isMethods: boolean;
    constructor(vm: Vuelite, exp: string, onUpdate: (newVal: any, oldVal?: any) => void, watchOption?: WatchOption);
    addDep(dep: Dep): void;
    getterTrigger(): any;
    update(): void;
}

declare class Dep {
    key: string;
    static activated: Observer;
    private listener;
    constructor(key: string);
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    notify(): void;
    depend(): void;
}

type Target = {
    [k: string]: any;
};
declare class Reactivity {
    proxy: Target;
    constructor(data: object);
    define(data: object): Target;
}

export { Dep, Directive, NodeVisitor, Observable, Observer, Reactivity, VueScanner, Vuelite as default, updaters };

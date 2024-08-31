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
};

type Accessor<Data, Methods, Computed> = {
    get?(this: Vuelite<Data, Methods, Computed>): any;
    set?(this: Vuelite<Data, Methods, Computed>, value: any): void;
};
interface Options<Data, Methods, Computed> {
    el: string;
    template?: string;
    data?: () => Data;
    methods?: Methods & ThisType<Data & Methods & Computed>;
    computed?: {
        [K in keyof Computed]: Computed[K] extends Accessor<Data, Methods, Computed> ? Computed[K] : (() => any) & ThisType<Data & Methods & Computed>;
    };
    watch?: {};
    styles?: {
        [K: string]: any;
    };
}

declare class Vuelite<Data = {}, Methods = {}, Computed = {}> {
    el: HTMLElement;
    template?: Element;
    options: Options<Data, Methods, Computed>;
    [customKey: string]: any;
    constructor(options: Options<Data, Methods, Computed>);
}

declare class Directive {
    private vm;
    private node;
    exp: any;
    modifier: string;
    template: string;
    constructor(name: string, vm: Vuelite, node: Node, exp: any);
    bind(updater?: Updater): void;
    model(): void;
    text(): void;
    style(): void;
    class(): void;
    html(): void;
    eventHandler(): void;
}

declare class Observable {
    vm: Vuelite;
    node: Node;
    constructor(vm: Vuelite, node: Node);
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
    private node2Fragment;
    scan(vm: Vuelite): void;
}

declare class Observer {
    private vm;
    private exp;
    private onUpdate;
    private value;
    private deps;
    constructor(vm: Vuelite, exp: string, onUpdate: (value: any) => void);
    addDep(dep: Dep): void;
    getterTrigger(): any;
    update(): void;
}

declare class Dep {
    static activated: Observer;
    private listener;
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
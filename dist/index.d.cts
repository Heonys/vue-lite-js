type HookNames = "beforeCreate" | "created" | "mounted" | "beforeUpdate" | "updated";
declare class Lifecycle<Data> {
    deferredTasks: Function[];
    private hooks;
    setHooks(options: Options<Data>): void;
    callHook(name: HookNames): void;
    clearTasks(): void;
}

type Accessor<Data> = {
    get?(this: Vuelite<Data>): any;
    set?(this: Vuelite<Data>, value: any): void;
};
type ComputedType<Data> = {
    [K: string]: Accessor<Data> | (() => any);
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
type ComponentMap = Map<Element, Vuelite>;
type MethodsType = {
    [key: string]: (...args: any[]) => void;
};
type Fallback = {
    [custom: string]: any;
};
type Options<Data = {}> = {
    el?: string;
    template?: string;
    props?: string[];
    data?: () => Data;
    methods?: MethodsType & ThisType<Data & Fallback>;
    computed?: ComputedType<Data> & ThisType<Data & Fallback>;
    watch?: WatchType;
    styles?: {
        [K: string]: any;
    };
    scopedStyles?: {
        [K: string]: any;
    };
    components?: {
        [K: string]: Options;
    };
} & {
    [Hook in Exclude<HookNames, "beforeCreate">]?: (this: Data) => void;
} & {
    beforeCreate?: (this: void) => void;
};
interface ComponentPublicInstance<Data> {
    $data: object;
    $el: Node;
    $props: Record<string, any>;
    $parent: Vuelite | null;
    $options: Options<Data>;
    $components: ComponentMap;
    $refs: {
        [name: string]: Element | null;
    };
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
}

declare class Vuelite<Data = {}> extends Lifecycle<Data> implements ComponentPublicInstance<Data> {
    $data: object;
    $el: HTMLElement | DocumentFragment;
    $options: Options<Data>;
    $props: Record<string, any>;
    $parent: Vuelite | null;
    $refs: {
        [name: string]: Element;
    };
    $components: ComponentMap;
    componentsNames: Record<string, Options>;
    updateQueue: Function[];
    static context?: Record<string, any>;
    [customKey: string]: any;
    constructor(options: Options<Data>);
    private setupDOM;
    render(): void;
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
    private localComponents;
    static globalComponentsNames: Record<string, Options>;
    static globalComponents: ComponentMap;
    static component(name: string, options: Options): void;
}

export { Vuelite as default };

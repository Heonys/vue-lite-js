type HookNames = "beforeCreate" | "created" | "beforeMount" | "mounted" | "beforeUpdate" | "updated";
declare class Lifecycle<Data> {
    deferredTasks: Function[];
    $hooks: {
        [K in HookNames]?: () => void;
    };
    setHooks(options: Options<Data>): void;
    callHook(name: HookNames): void;
    clearTasks(): void;
}

type FilteredProps = "$watch" | "$forceUpdate" | "setHooks" | "callHook" | "clearTasks" | "$el";
type AppInstance = Omit<Vuelite, FilteredProps> & {
    $fragment?: DocumentFragment;
    component(name: string, options: Options): AppInstance;
    mount(selector: string): void;
};
interface Ref<T = any> {
    value: T;
    __v_exp: string;
}
type ComputedFn<T> = (oldValue: T | undefined) => T;
type ComputedOption<T> = {
    get: (oldValue: T | undefined) => T;
    set: (value: T) => void;
};
type ComputedInput<T = any> = ComputedFn<T> | ComputedOption<T>;
type WatchCallback$1<T = any> = (value: T, oldValue: T) => void;
type StopHandle = () => void;

type Accessor<Data> = {
    get?(this: Data): any;
    set?(this: Data, value: any): void;
};
type ComputedType<Data> = {
    [K: string]: Accessor<Data> | (() => any);
};
type WatchCallback = (this: Vuelite, newVal: any, oldVal: any) => void;
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
type BaseOption<Data> = {
    props?: string[];
    data?: () => Data;
    methods?: MethodsType & ThisType<Data & Fallback>;
    computed?: ComputedType<Data>;
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
type Options<Data = {}> = BaseOption<Data> & {
    el?: string;
    template?: string;
};
type CompositionAPIOptions<Data = {}> = BaseOption<Data> & {
    setup?: (props: any) => SetupResult | void;
};
type SetupResult = {
    [key: string]: Ref | Function | object;
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
    [custom: string]: any;
    static context?: Record<string, any>;
    constructor(options: Options<Data>);
    mount(selector?: string): void;
    private render;
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
    private setupDOM;
    private localComponents;
    static globalComponentsNames: Record<string, Options>;
    static globalComponents: ComponentMap;
    static component(name: string, options: Options): void;
}

declare function ref$1<T>(value: T): Ref<T>;
declare function reactive$1<T extends object>(target: T): T;
declare function computed$1<T>(input: ComputedInput<T>): Ref<T>;

declare function watch$1<T>(source: Ref<T>, callback: WatchCallback$1<T>): void;

declare function isRef$1<T>(value: any): value is Ref<T>;
declare function isProxy$1<T extends object>(value: T): boolean;

declare function onBeforeMount$1(callback: StopHandle): void;
declare function onMounted$1(callback: StopHandle): void;
declare function onBeforeUpdate$1(callback: StopHandle): void;
declare function onUpdated$1(callback: StopHandle): void;

declare function createApp$1(options: CompositionAPIOptions): AppInstance;

declare const createApp: typeof createApp$1;
declare const ref: typeof ref$1;
declare const reactive: typeof reactive$1;
declare const computed: typeof computed$1;
declare const watch: typeof watch$1;
declare const isRef: typeof isRef$1;
declare const isProxy: typeof isProxy$1;
declare const onBeforeMount: typeof onBeforeMount$1;
declare const onMounted: typeof onMounted$1;
declare const onBeforeUpdate: typeof onBeforeUpdate$1;
declare const onUpdated: typeof onUpdated$1;

export { computed, createApp, Vuelite as default, isProxy, isRef, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, reactive, ref, watch };

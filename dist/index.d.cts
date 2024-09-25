import { Ref, ComputedInput, WatchCallback as WatchCallback$1, StopHandle, AppInstance } from '@/types/compositionApi';

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

type Accessor<Data> = {
    get?(this: Data): any;
    set?(this: Data, value: any): void;
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

declare function ref<T>(value: T): Ref<T>;
declare function reactive<T extends object>(target: T): T;
declare function computed<T>(input: ComputedInput<T>): Ref<T>;

declare function watch<T>(source: Ref, callback: WatchCallback$1<T>): void;

declare function isRef<T>(value: any): value is Ref<T>;
declare function isProxy<T extends object>(value: T): boolean;

declare function onBeforeMount(callback: StopHandle): void;
declare function onMounted(callback: StopHandle): void;
declare function onBeforeUpdate(callback: StopHandle): void;
declare function onUpdated(callback: StopHandle): void;
declare function bindHooks(vm: Vuelite): void;

declare function createApp(options: CompositionAPIOptions): AppInstance;

export { bindHooks, computed, createApp, Vuelite as default, isProxy, isRef, onBeforeMount, onBeforeUpdate, onMounted, onUpdated, reactive, ref, watch };

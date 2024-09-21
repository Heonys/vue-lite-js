import { HookNames } from "./lifecycle";
import Vuelite from "./vuelite";
type Accessor<Data> = {
    get?(this: Vuelite<Data>): any;
    set?(this: Vuelite<Data>, value: any): void;
};
type ComputedType<Data> = {
    [K: string]: Accessor<Data> | (() => any);
};
export type WatchCallback = (newVal: any, oldVal: any) => void;
export type WatchOption = {
    immediate?: boolean;
};
type WatchObject = {
    [K in keyof WatchOption]: WatchOption[K];
} & {
    handler: WatchCallback;
};
export type WatchType = {
    [K: string]: WatchCallback | WatchObject;
};
export type ComponentMap = Map<Element, Vuelite>;
type MethodsType = {
    [key: string]: (...args: any[]) => void;
};
type Fallback = {
    [custom: string]: any;
};
export type Options<Data = {}> = {
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
type AccessorForm = {
    get?(): any;
    set?(value: any): void;
};
export declare function isAccessor(data: Function | AccessorForm): data is AccessorForm;
export declare function isWatchMethod(value: any): value is WatchCallback;
export interface ComponentPublicInstance<Data> {
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
export {};

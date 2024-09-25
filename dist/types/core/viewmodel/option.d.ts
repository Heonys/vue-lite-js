import { HookNames } from "./lifecycle";
import Vuelite from "./vuelite";
import { Ref } from "../../types/compositionApi";
type Accessor<Data> = {
    get?(this: Data): any;
    set?(this: Data, value: any): void;
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
export type Options<Data = {}> = BaseOption<Data> & {
    el?: string;
    template?: string;
};
export type CompositionAPIOptions<Data = {}> = BaseOption<Data> & {
    setup?: (props: any) => SetupResult | void;
};
export type SetupResult = {
    [key: string]: Ref | Function | object;
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

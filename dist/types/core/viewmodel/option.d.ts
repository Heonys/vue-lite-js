import { HookNames } from "./lifecycle";
import Vuelite from "./vuelite";
type Accessor<Data, Methods, Computed> = {
    get?(this: Vuelite<Data, Methods, Computed>): any;
    set?(this: Vuelite<Data, Methods, Computed>, value: any): void;
};
type ComputedType<Data, Methods, Computed> = {
    [K: string]: Accessor<Data, Methods, Computed> | (() => any);
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
export type Options<Data = {}, Methods = {}, Computed = {}> = {
    el?: string;
    template?: string;
    props?: string[];
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
type AccessorForm = {
    get?(): any;
    set?(value: any): void;
};
export declare function isAccessor(data: Function | AccessorForm): data is AccessorForm;
export declare function isWatchMethod(value: any): value is WatchCallback;
export interface ComponentPublicInstance {
    $data: object;
    $el: Node | null;
    $options: Options;
    $refs: {
        [name: string]: Element | null;
    };
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
}
export {};

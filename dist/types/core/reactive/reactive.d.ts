import Vuelite from "../viewmodel/vuelite";
type Target = {
    [k: string]: any;
};
export declare class Reactivity {
    proxy: Target;
    constructor(data: object);
    define(data: object): Target;
}
export declare function injectReactive(vm: Vuelite): void;
export {};

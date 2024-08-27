import Vuelite from "./vuelite";
type Accessor = {
    get(this: Vuelite): any;
    set(this: Vuelite, value: any): void;
};
export interface Options {
    el: string;
    template?: string;
    data?: () => {
        [Key: string]: any;
    };
    methods?: {
        [Key: string]: (this: Vuelite, ...args: any[]) => void;
    };
    computed?: {
        [Key: string]: ((this: Vuelite) => any) | Accessor;
    };
    watch?: {};
    styles?: {
        [K: string]: any;
    };
}
export declare function isAccessor(data: Function | Accessor): data is Accessor;
export {};

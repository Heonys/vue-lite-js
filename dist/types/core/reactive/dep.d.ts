import { Observer } from "./observer";
export declare class Dep {
    key: string;
    static activated: Observer;
    private listener;
    constructor(key: string);
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    notify(): void;
    depend(): void;
}
export declare class Store {
    private static globalDeps;
    static getStore(): Map<string, Dep>[];
    static addStore(deps: Map<string, Dep>): void;
    static forceUpdate(): void;
}

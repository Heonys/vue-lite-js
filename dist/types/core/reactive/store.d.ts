import { Dep } from "./dep";
import { Observer } from "./observer";
export declare class Store {
    private static globalDeps;
    private static globalObservers;
    static getStore(): Map<string, Dep>[];
    static addStore(deps: Map<string, Dep>): void;
    static forceUpdate(): void;
    static addObserver(observer: Observer): void;
    static updateMethods(): void;
}

import { Observer } from "./observer";
export declare class Dep {
    static activated: Observer;
    private listener;
    subscribe(observer: Observer): void;
    unsubscribe(observer: Observer): void;
    notify(): void;
    depend(): void;
}

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

import { Options } from "./option";
export type HookNames = "beforeCreate" | "created" | "mounted" | "beforeUpdate" | "updated";
export declare class Lifecycle<Data, Methods, Computed> {
    deferredTasks: Function[];
    private hooks;
    setHooks(options: Options<Data, Methods, Computed>): void;
    callHook(name: HookNames): void;
    clearTasks(): void;
}

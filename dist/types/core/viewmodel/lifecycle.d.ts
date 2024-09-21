import { Options } from "./option";
export type HookNames = "beforeCreate" | "created" | "mounted" | "beforeUpdate" | "updated";
export declare class Lifecycle<Data> {
    deferredTasks: Function[];
    private hooks;
    setHooks(options: Options<Data>): void;
    callHook(name: HookNames): void;
    clearTasks(): void;
}

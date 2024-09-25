import { Options } from "./option";
export type HookNames = "beforeCreate" | "created" | "beforeMount" | "mounted" | "beforeUpdate" | "updated";
export declare class Lifecycle<Data> {
    deferredTasks: Function[];
    $hooks: {
        [K in HookNames]?: () => void;
    };
    setHooks(options: Options<Data>): void;
    callHook(name: HookNames): void;
    clearTasks(): void;
}

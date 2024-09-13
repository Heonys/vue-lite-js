import { typeOf } from "@/utils/format";
import { Options } from "./option";

export type HookNames = "beforeCreate" | "created" | "mounted" | "beforeUpdate" | "updated";

export class Lifecycle<Data, Methods, Computed> {
  deferredTasks: Function[] = [];
  private hooks: { [K in HookNames]?: () => void };

  setHooks(options: Options<Data, Methods, Computed>) {
    this.hooks = options;
  }

  callHook(name: HookNames) {
    const method = this.hooks[name];
    if (typeOf(method) === "function") {
      method.call(this);
    }
  }

  clearTasks() {
    this.deferredTasks.forEach((fn) => fn());
    this.deferredTasks = [];
  }
}

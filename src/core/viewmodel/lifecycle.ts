import { typeOf } from "@/utils/format";
import { Options } from "./option";

export type HookNames =
  | "beforeCreate"
  | "created"
  | "beforeMount"
  | "mounted"
  | "beforeUpdate"
  | "updated";

export class Lifecycle<Data> {
  deferredTasks: Function[] = [];
  private hooks: { [K in HookNames]?: () => void };

  setHooks(options: Options<Data>) {
    this.hooks = options;
  }

  callHook(name: HookNames) {
    const method = this.hooks[name];
    if (typeOf(method) === "function") {
      name === "beforeCreate" ? method.call(null) : method.call(this);
    }
  }

  clearTasks() {
    this.deferredTasks.forEach((fn) => fn());
    this.deferredTasks = [];
  }
}

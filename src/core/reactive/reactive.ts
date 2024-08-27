import { isObject } from "@utils/format";
import { isAccessor } from "../viewmodel/option";
import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";

type Target = { [k: string]: any };

export class Reactivity {
  public proxy: Target;

  constructor(data: object) {
    this.proxy = this.define(data);
  }

  define(data: object) {
    const me = this;
    const caches = new Map<string, Target>();
    const deps = new Map<string, Dep>();

    const handler = {
      get(target: Target, key: string, receiver: Target) {
        if (!deps.has(key)) deps.set(key, new Dep());
        deps.get(key).depend();

        const child = target[key];

        if (isObject(child)) {
          if (!caches.has(key)) caches.set(key, me.define(child));
          return caches.get(key);
        }
        return Reflect.get(target, key, receiver);
      },
      set(target: Target, key: string, value: any, receiver: Target) {
        const result = Reflect.set(target, key, value, receiver);

        if (deps.has(key)) {
          deps.get(key).notify();
        }
        return result;
      },
    };

    return new Proxy(data, handler);
  }
}

export function injectReactive(vm: Vuelite) {
  const { data } = vm.options;
  const returned = typeof data === "function" ? data() : {};
  const proxy = new Reactivity(returned).proxy;

  for (const key in returned) {
    Object.defineProperty(vm, key, {
      // enumerable: true,
      configurable: false,
      get: () => proxy[key],
      set: (value) => {
        proxy[key] = value;
      },
    });
  }

  injectMethod(vm);
  injectComputed(vm);
}

function injectMethod(vm: Vuelite) {
  const { methods } = vm.options;
  if (!methods) return;

  Object.entries(methods).forEach(([key, method]) => {
    if (Object.hasOwn(vm, key)) throw new Error(`${key} has already been declared`);
    Object.defineProperty(vm, key, {
      value: (...args: any[]) => method.apply(vm, args),
    });
  });
}

function injectComputed(vm: Vuelite) {
  const { computed } = vm.options;
  if (!computed) return;

  for (const key in computed) {
    if (Object.hasOwn(vm, key)) throw new Error(`${key} has already been declared`);
  }

  Object.entries(computed).forEach(([key, value]) => {
    const descripter: PropertyDescriptor = {};
    if (isAccessor(value)) {
      descripter.get = value.get.bind(vm);
      descripter.set = (...params) => {
        value.set.apply(vm, params);
      };
    } else {
      descripter.get = () => value.call(vm);
    }
    Object.defineProperty(vm, key, descripter);
  });
}

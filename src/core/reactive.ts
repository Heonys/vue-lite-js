import { Vuelite } from "../render";
import { isObject } from "../utils/index";
import { Dep } from "./observer";
import { isAccessor } from "./option";

type Target = { [k: string]: any };

class Reactivity {
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
        if (isObject(value)) caches.set(key, me.define(value));
        else caches.delete(key);

        if (deps.has(key)) {
          deps.get(key).notify();
        }
        return Reflect.set(target, key, value, receiver);
      },
    };

    return new Proxy(data, handler);
  }
}

export function injectReactive(vm: Vuelite) {
  const { data, methods } = vm.options;
  const returned = typeof data === "function" ? data() : {};
  const proxy = new Reactivity(returned).proxy;

  for (const key in returned) {
    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: false,
      get: () => proxy[key],
      set: (value) => {
        proxy[key] = value;
      },
    });
  }

  Object.entries(methods).forEach(([key, method]) => {
    if (Object.hasOwn(vm, key)) throw new Error(`${key} has already been declared`);
    Object.defineProperty(vm, key, {
      value: (...args: any[]) => method.apply(vm, args),
    });
  });

  injectComputed(vm);
}

function injectComputed(vm: Vuelite) {
  const { computed } = vm.options;

  for (const key in computed) {
    if (Object.hasOwn(vm, key)) throw new Error(`${key} has already been declared`);
  }

  Object.entries(computed).forEach(([key, value]) => {
    const descripter: PropertyDescriptor = {};
    if (isAccessor(value)) {
      descripter.get = value.get.bind(vm);
      descripter.set = (params) => {
        value.set.call(vm, ...params);
      };
    } else {
      descripter.get = () => value;
    }
    Object.defineProperty(vm, key, descripter);
  });
}

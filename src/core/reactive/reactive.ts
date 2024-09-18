import { isFunction, isObject, typeOf } from "@utils/format";
import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { isAccessor } from "../viewmodel/option";
import { Store } from "./store";
import { initializeProps, isReserved } from "@/utils/common";

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
    Store.addStore(deps);

    const handler = {
      get(target: Target, key: string, receiver: Target) {
        if (typeOf(key) === "symbol") return Reflect.get(target, key, receiver);
        if (!deps.has(key)) deps.set(key, new Dep(key));
        deps.get(key).depend();

        const child = target[key];
        if (isObject(child)) {
          if (!caches.has(key)) caches.set(key, me.define(child));
          return caches.get(key);
        }
        return Reflect.get(target, key, receiver);
      },
      set(target: Target, key: string, value: any, receiver: Target) {
        const oldLength = target._length;
        const result = Reflect.set(target, key, value, receiver);
        const newLength = target._length;

        if (oldLength !== newLength && deps.has("_length")) {
          deps.get("_length").notify();
        }
        if (deps.has(key)) {
          deps.get(key).notify();
        }
        return result;
      },
      deleteProperty(target: Target, property: string) {
        const oldLength = target._length;
        const result = Reflect.deleteProperty(target, property);
        const newLength = target._length;

        if (oldLength !== newLength && deps.has("_length")) {
          deps.get("_length").notify();
        }
        return result;
      },
    };

    return new Proxy(data, handler);
  }
}

export function injectReactive(vm: Vuelite) {
  const { data, props } = vm.$options;
  const returned = isFunction(data) ? data() : {};
  const proxy = new Reactivity(returned).proxy;

  Object.defineProperty(vm, "$data", { get: () => proxy });
  for (const key in returned) {
    if (!isReserved(key)) {
      Object.defineProperty(vm, key, {
        configurable: false,
        get: () => proxy[key],
        set: (value) => {
          proxy[key] = value;
        },
      });
    }
  }

  if (props) {
    const propsState = initializeProps(props);
    const proxyProps = new Reactivity(propsState).proxy;
    Object.defineProperty(vm, "$props", { get: () => proxyProps });
    for (const key in propsState) {
      Object.defineProperty(vm, key, {
        configurable: false,
        get: () => proxyProps[key],
        set: (_) => {},
      });
    }
  }

  injectMethod(vm);
  injectComputed(vm);
}

function injectMethod(vm: Vuelite) {
  const { methods } = vm.$options;
  if (!methods) return;

  Object.entries(methods).forEach(([key, method]) => {
    if (Object.hasOwn(vm, key)) throw new Error(`${key} has already been declared`);
    Object.defineProperty(vm, key, {
      value: (...args: any[]) => method.apply(vm, args),
    });
  });
}

function injectComputed(vm: Vuelite) {
  const { computed } = vm.$options;
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
      descripter.get = () => (value as Function).call(vm);
    }
    Object.defineProperty(vm, key, descripter);
  });
}

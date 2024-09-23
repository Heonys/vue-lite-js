import { isPlainObject } from "@/utils/format";
import { Dep } from "../reactive/dep";
import type { Ref, SetupResult, UnwrapNestedRefs, UnwrapRef } from "@/types/compositionApi";
import Vuelite from "../viewmodel/vuelite";
import { isFunction } from "@/utils/format";
import { isReactive, isRef } from "./util";

const deps = new WeakMap<object, Map<string | symbol, Dep>>();

export function ref<T>(value: T): Ref<UnwrapRef<T>> {
  if (isPlainObject(value)) {
    value = reactive(value) as T;
  }
  const trackedRef = Object.defineProperties({} as Ref, {
    value: {
      configurable: false,
      enumerable: true,
      get: () => {
        track(trackedRef, "value");
        return value;
      },
      set: (newVal) => {
        value = newVal;
        trigger(trackedRef, "value");
      },
    },
    __v_isRef: {
      configurable: false,
      enumerable: false,
      value: true,
    },
  });
  return trackedRef;
}

export function reactive<T extends object>(target: T) {
  const handler = {
    get(target: T, key: string, receiver: T) {
      const result = Reflect.get(target, key, receiver);
      track(target, key);
      return result;
    },
    set(target: T, key: string, value: any, receiver: T) {
      const result = Reflect.set(target, key, value, receiver);
      trigger(target, key);
      return result;
    },
  };
  const proxy = new Proxy(target, handler) as UnwrapNestedRefs<T>;

  return Object.defineProperty(proxy, "__v_isReactive", {
    configurable: false,
    enumerable: false,
    value: true,
  });
}

function track(target: object, key: string) {
  if (!deps.has(target)) deps.set(target, new Map<string, Dep>());
  const depsMap = deps.get(target);
  if (!depsMap.has(key)) depsMap.set(key, new Dep());
  const dep = depsMap.get(key);
  dep.depend();
}

function trigger(target: object, key: string) {
  const depsMap = deps.get(target);
  if (!depsMap) return;
  const dep = depsMap.get(key);
  dep && dep.notify();
}

export function injectRef(vm: Vuelite, refs: SetupResult) {
  Object.entries(refs).forEach(([key, result]) => {
    if (isFunction(result)) {
      Object.defineProperty(vm, key, {
        configurable: false,
        value: (...args: any[]) => result.apply(vm, args),
      });
    } else if (isRef(result)) {
      Object.defineProperty(vm, key, {
        configurable: false,
        get: () => result.value,
        set: (value) => {
          result.value = value;
        },
      });
    } else if (isReactive(result)) {
      Object.defineProperty(vm, key, {
        configurable: false,
        get: () => result,
      });
    }
  });
}

export function computed() {}
export function watch() {}
export function watchEffect() {}
export function defineProps() {}

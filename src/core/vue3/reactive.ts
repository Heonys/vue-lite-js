import { isPlainObject } from "@/utils/format";
import { Dep } from "../reactive/dep";
import type { ComputedInput, Ref } from "@/types/compositionApi";
import type { SetupResult } from "../viewmodel/option";
import Vuelite from "../viewmodel/vuelite";
import { isFunction } from "@/utils/format";
import { isProxy, isRef } from "./util";

const deps = new WeakMap<object, Map<string | symbol, Dep>>();
const computedMap = new WeakMap<Ref, ComputedInput>();

export function ref<T>(value: T): Ref<T> {
  if (isPlainObject(value)) {
    value = reactive(value);
  }
  const trackedRef = Object.defineProperties({} as Ref, {
    value: {
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
      value: true,
    },
    __v_exp: {
      writable: true,
      value: "",
    },
  });
  return trackedRef;
}

export function reactive<T extends object>(target: T): T {
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
  const proxy = new Proxy(target, handler);
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

export function injectReactivity(vm: Vuelite, refs: SetupResult) {
  Object.entries(refs).forEach(([key, result]) => {
    if (isFunction(result)) {
      Object.defineProperty(vm, key, {
        configurable: false,
        value: (...args: any[]) => result.apply(vm, args),
      });
    } else if (isRef(result) && computedMap.has(result)) {
      result.__v_exp = key;
      const computed = computedMap.get(result);
      const descripter: PropertyDescriptor = {};
      if (isFunction(computed)) {
        descripter.get = () => computed.call(vm);
      } else {
        descripter.get = computed.get.bind(vm);
        descripter.set = (...params) => {
          computed.set.apply(vm, params);
        };
      }
      Object.defineProperty(vm, key, descripter);
    } else if (isRef(result)) {
      result.__v_exp = key;
      Object.defineProperty(vm, key, {
        configurable: false,
        get: () => result.value,
        set: (value) => {
          result.value = value;
        },
      });
    } else if (isProxy(result)) {
      Object.defineProperty(vm, key, {
        configurable: false,
        get: () => result,
      });
    }
  });
}

export function computed<T>(input: ComputedInput<T>) {
  if (isFunction(input)) {
    const initRef = ref(input(undefined));
    computedMap.set(initRef, input);
    return initRef;
  } else {
    const { get } = input;
    const initRef = ref(get(undefined));
    computedMap.set(initRef, input);
    return initRef;
  }
}

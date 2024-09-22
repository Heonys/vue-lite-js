// import { isPlainObject } from "@/utils/format";
import { Dep } from "../reactive/dep";
import type { Ref, SetupResult } from "@/types/compositionApi";
import Vuelite from "../viewmodel/vuelite";
import { isFunction } from "@/utils/format";

const deps = new WeakMap<Ref, Dep>();

export function ref<T>(value: T): Ref<T> {
  const trackedRef = Object.defineProperty({} as Ref, "value", {
    configurable: false,
    enumerable: true,
    get: () => {
      track(trackedRef);
      return value;
    },
    set: (newVal) => {
      value = newVal;
      trigger(trackedRef);
    },
  });
  return trackedRef;
}

function track(ref: Ref) {
  if (!deps.has(ref)) deps.set(ref, new Dep());
  deps.get(ref).depend();
}

function trigger(ref: Ref) {
  if (deps.has(ref)) {
    deps.get(ref).notify();
  }
}

export function injectRef(vm: Vuelite, refs: SetupResult) {
  Object.entries(refs).forEach(([key, result]) => {
    if (isFunction(result)) {
      Object.defineProperty(vm, key, {
        configurable: false,
        value: (...args: any[]) => result.apply(vm, args),
      });
    } else {
      Object.defineProperty(vm, key, {
        configurable: false,
        get: () => result.value,
        set: (value) => {
          result.value = value;
        },
      });
    }
  });
}

export function reactive<T extends object>(target: T) {
  //
}

/* 











*/
export function computed() {}
export function watch() {}
export function watchEffect() {}
export function defineProps() {}

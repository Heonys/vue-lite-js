import type { CompositionHookNames, StopHandle } from "../../types/compositionApi";
import Vuelite from "../viewmodel/vuelite";

const hooks: { [K in CompositionHookNames]?: StopHandle } = {};

export function onBeforeMount(callback: StopHandle) {
  hooks.beforeMount = callback;
}
export function onMounted(callback: StopHandle) {
  hooks.mounted = callback;
}
export function onBeforeUpdate(callback: StopHandle) {
  hooks.beforeUpdate = callback;
}
export function onUpdated(callback: StopHandle) {
  hooks.updated = callback;
}

export function bindHooks(vm: Vuelite) {
  for (const key in hooks) {
    const hookKey = key as CompositionHookNames;
    vm.$hooks[hookKey] = hooks[hookKey];
  }
}

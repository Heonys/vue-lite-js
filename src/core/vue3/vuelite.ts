import { CompositionAPIOptions, Options } from "../viewmodel/option";
import Vuelite from "../viewmodel/vuelite";

export function createApp(options: CompositionAPIOptions) {
  const app = new Vuelite(options);
  return {
    ...app,
    component(name: string, options: Options) {
      Vuelite.component(name, options);
    },
    mount(selector: string) {
      app.mount(selector);
    },
  };
}

// 반응형 API
export function ref() {}
export function reactive() {}
export function computed() {}
export function watch() {}
export function watchEffect() {}
export function defineProps() {}

// 생명주기 API
export function onBeforeMount() {}
export function onMounted() {}
export function onBeforeUpdate() {}
export function onUpdated() {}

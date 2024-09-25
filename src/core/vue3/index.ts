import Vuelite from "../viewmodel/vuelite";
import { AppInstance } from "@/types/compositionApi";
import type { CompositionAPIOptions, Options, SetupResult } from "../viewmodel/option";
import { injectReactivity, ref, reactive, computed } from "./reactive";
import { createWacher, watch } from "./watch";
import { bindHooks } from "./lifecycle";

export function createApp(options: CompositionAPIOptions): AppInstance {
  const app = new Vuelite(options);
  const reactive = options.setup.call(app, app.$props) as SetupResult;
  injectReactivity(app, reactive);
  createWacher(app);
  bindHooks(app);
  return {
    ...app,
    component(name: string, options: Options) {
      Vuelite.component(name, options);
      return this;
    },
    mount(selector: string) {
      app.mount(selector);
    },
  };
}

export * from "./util";
export * from "./lifecycle";
export { ref, reactive, computed, watch };

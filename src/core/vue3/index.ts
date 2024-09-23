import Vuelite from "../viewmodel/vuelite";
import type { CompositionAPIOptions, SetupResult } from "@/types/compositionApi";
import { Options } from "../viewmodel/option";
import { injectReactivity, ref, reactive, computed } from "./reactive";
import { createWacher, watch } from "./watch";
import { bindHooks } from "./lifecycle";

function createApp(options: CompositionAPIOptions) {
  const app = new Vuelite(options);
  const reactive = options.setup.call(app, app.$props) as SetupResult;
  injectReactivity(app, reactive);
  createWacher(app);
  bindHooks(app);
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

export * from "./util";
export * from "./lifecycle";
export { createApp, ref, reactive, computed, watch };

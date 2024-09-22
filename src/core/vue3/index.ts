import Vuelite from "../viewmodel/vuelite";
import type { CompositionAPIOptions, SetupResult } from "@/types/compositionApi";
import { Options } from "../viewmodel/option";
import { injectRef, ref } from "./reactive";

function createApp(options: CompositionAPIOptions) {
  const app = new Vuelite(options);
  const reactive = options.setup.call(app, app.$props) as SetupResult;
  console.log(reactive);

  injectRef(app, reactive);
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

export { createApp, ref };

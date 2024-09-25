import Vuelite from "./core/viewmodel/vuelite";
import { typeOf } from "./utils/format";
import * as Vue3 from "./core/vue3/index";

Object.defineProperty(Object.prototype, "_length", {
  get: function () {
    if (Object.hasOwn(this, "length")) {
      return this.length;
    } else if (typeOf(this) === "object") {
      return Object.keys(this).length;
    } else {
      return 0;
    }
  },
  enumerable: false,
});

export default Vuelite;
export const {
  createApp,
  ref,
  reactive,
  computed,
  watch,
  isRef,
  isProxy,
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
} = Vue3;

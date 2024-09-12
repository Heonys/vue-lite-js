import { Directive } from "./core/binder/directive";
import { Observable } from "./core/binder/observable";
import { VueScanner } from "./core/binder/scanner";
import { updaters } from "./core/binder/updaters";
import { NodeVisitor } from "./core/binder/visitor";
import { Dep } from "./core/reactive/dep";
import { Observer } from "./core/reactive/observer";
import { Reactivity } from "./core/reactive/reactive";
import Vuelite from "./core/viewmodel/vuelite";
import { typeOf } from "./utils/format";

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
export { Directive, Observable, VueScanner, updaters, NodeVisitor, Dep, Observer, Reactivity };

import { createDOMTemplate } from "@utils/common";
import { ComponentPublicInstance, WatchCallback, WatchOption, type Options } from "./option";
import { injectReactive } from "../reactive/reactive";
import { createStyleSheet } from "./style";
import { VueScanner } from "../binder/scanner";
import { NodeVisitor } from "../binder/visitor";
import { Lifecycle } from "./lifecycle";
import { typeOf } from "@/utils/format";
import { createWatcher, Observer } from "../reactive/observer";
import { Store } from "../reactive/store";

export default class Vuelite<D = {}, M = {}, C = {}>
  extends Lifecycle<D, M, C>
  implements ComponentPublicInstance
{
  $data: object;
  $el: HTMLElement;
  template?: Element;
  $options: Options<D, M, C>;
  $refs: { [name: string]: Element };
  updateQueue: Function[] = [];
  static context?: Record<string, any>;
  [customKey: string]: any;

  constructor(options: Options<D, M, C>) {
    super();
    this.$options = options;
    this.setHooks(this.$options);
    this.$el = document.querySelector(options.el);
    this.template = createDOMTemplate(options.template);
    this.$refs = {};
    this.callHook("beforeCreate");

    injectReactive(this);
    createStyleSheet(this);
    createWatcher(this);
    this.callHook("created");

    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);
    this.callHook("mounted");

    requestAnimationFrame(() => this.render());
  }

  render() {
    if (this.updateQueue.length > 0) {
      this.callHook("beforeUpdate");
      while (this.updateQueue.length > 0) {
        const fn = this.updateQueue.shift();
        if (typeOf(fn) === "function") fn();
      }
      Store.updateMethods();
      this.callHook("updated");
    }
    requestAnimationFrame(() => this.render());
  }

  $watch(source: string, callback: WatchCallback, options?: WatchOption): void {
    new Observer(this, source, callback, options);
  }

  $forceUpdate() {
    Store.forceUpdate();
  }
}

import { createDOMTemplate } from "@utils/common";
import { type Options } from "./option";
import { injectReactive } from "../reactive/reactive";
import { injectStyleSheet } from "./style";
import { VueScanner } from "../binder/scanner";
import { NodeVisitor } from "../binder/visitor";
import { Lifecycle } from "./lifecycle";
import { typeOf } from "@/utils/format";

export default class Vuelite<D = {}, M = {}, C = {}> extends Lifecycle<D, M, C> {
  el: HTMLElement;
  template?: Element;
  options: Options<D, M, C>;
  virtual: Node;
  updateQueue: Function[] = [];
  static context?: Record<string, any>;
  [customKey: string]: any;

  constructor(options: Options<D, M, C>) {
    super();
    this.options = options;
    this.setHooks(options);

    this.el = document.querySelector(options.el);
    this.template = createDOMTemplate(options.template);
    this.callHook("beforeCreate");

    injectReactive(this);
    injectStyleSheet(this);
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
      this.callHook("updated");
    }
    requestAnimationFrame(() => this.render());
  }
}

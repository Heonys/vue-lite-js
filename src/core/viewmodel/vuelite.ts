import { createDOMTemplate } from "@utils/common";
import { type Options } from "./option";
import { injectReactive } from "../reactive/reactive";
import { injectStyleSheet } from "./style";
import { VueScanner } from "../binder/scanner";
import { NodeVisitor } from "../binder/visitor";
import { Lifecycle } from "./lifecycle";

type UpdateQueue = { value: any; updater: (value: any) => void };

export default class Vuelite<D = {}, M = {}, C = {}> extends Lifecycle<D, M, C> {
  el: HTMLElement;
  template?: Element;
  options: Options<D, M, C>;
  deferredTasks: Function[] = [];
  updateQueue: UpdateQueue[] = [];
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
    while (this.updateQueue.length > 0) {
      const q = this.updateQueue.shift();
      if (q) {
        q.updater.call(this, q.value);
      }
    }
    requestAnimationFrame(() => this.render());
  }

  clearTasks() {
    this.deferredTasks.forEach((fn) => fn());
    this.deferredTasks = [];
  }
}

import { createDOMTemplate } from "@utils/common";
import {
  ComponentMap,
  ComponentPublicInstance,
  WatchCallback,
  WatchOption,
  Options,
} from "./option";
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
  $options: Options<D, M, C>;
  $props: Record<string, any> = {};
  $parent: Vuelite | null = null;
  $refs: { [name: string]: Element } = {};
  $components: ComponentMap = {};
  updateQueue: Function[] = [];
  static context?: Record<string, any>;
  [customKey: string]: any;

  constructor(options: Options<D, M, C>) {
    super();
    this.$options = options;
    this.setHooks(this.$options);
    this.setupDOM(options);
    this.localComponents(options);
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

  setupDOM(options: Options<D, M, C>) {
    if (options.template) {
      this.$el = createDOMTemplate(options.template);
    } else {
      const el = document.querySelector(options.el) as HTMLElement;
      if (el instanceof HTMLTemplateElement) {
        this.$el = el.content.firstElementChild as HTMLElement;
      } else {
        this.$el = el;
      }
    }
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

  localComponents(options: Options) {
    const { components } = options;
    if (!components) return;
    Object.entries(components).forEach(([name, options]) => {
      this.$components[name.toLocaleUpperCase()] = new Vuelite(options);
    });
  }

  static globalComponents: ComponentMap = {};
  static component(name: string, options: Options) {
    this.globalComponents[name.toLocaleUpperCase()] = new Vuelite(options);
  }
}

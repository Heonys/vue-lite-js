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
import { isFunction, isTemplateElement } from "@/utils/format";
import { createWatcher, Observer } from "../reactive/observer";
import { Store } from "../reactive/store";

export default class Vuelite<Data = {}>
  extends Lifecycle<Data>
  implements ComponentPublicInstance<Data>
{
  $data: object;
  $el: HTMLElement | DocumentFragment;
  $options: Options<Data>;
  $props: Record<string, any> = {};
  $parent: Vuelite | null = null;
  $refs: { [name: string]: Element } = {};
  $components: ComponentMap = new Map();
  componentsNames: Record<string, Options> = {};
  updateQueue: Function[] = [];
  static context?: Record<string, any>;

  constructor(options: Options<Data>) {
    super();
    this.$options = options;
    this.setHooks(this.$options);
    this.localComponents(options);
    this.callHook("beforeCreate");

    injectReactive(this);
    createWatcher(this);
    this.callHook("created");

    if (!this.setupDOM(options)) return this;
    this.mount();
  }

  mount(selector?: string) {
    this.callHook("beforeMount");
    if (selector) {
      this.$el = document.querySelector(selector) as HTMLElement;
    }
    createStyleSheet(this);
    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);
    this.callHook("mounted");

    requestAnimationFrame(() => this.render());
  }

  private render() {
    if (this.updateQueue.length > 0) {
      this.callHook("beforeUpdate");
      while (this.updateQueue.length > 0) {
        const fn = this.updateQueue.shift();
        if (isFunction(fn)) fn();
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

  private setupDOM(options: Options<Data>) {
    if (options.template) {
      return (this.$el = createDOMTemplate(options.template));
    } else if (options.el) {
      const el = document.querySelector(options.el) as HTMLElement;
      if (isTemplateElement(el)) {
        return (this.$el = el.content.cloneNode(true) as DocumentFragment);
      } else {
        return (this.$el = el);
      }
    } else return null;
  }

  private localComponents(options: Options<Data>) {
    const { components } = options;
    if (!components) return;
    Object.entries(components).forEach(([name, options]) => {
      this.componentsNames[name.toUpperCase()] = options;
    });
  }

  static globalComponentsNames: Record<string, Options> = {};
  static globalComponents: ComponentMap = new Map();
  static component(name: string, options: Options) {
    this.globalComponentsNames[name.toLocaleUpperCase()] = options;
  }
}

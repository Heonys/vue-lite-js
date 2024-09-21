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
import { isTemplateElement, typeOf } from "@/utils/format";
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
  [customKey: string]: any;

  constructor(options: Options<Data>) {
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

  private setupDOM(options: Options<Data>) {
    if (options.template) {
      this.$el = createDOMTemplate(options.template);
    } else {
      const el = document.querySelector(options.el) as HTMLElement;
      if (isTemplateElement(el)) {
        this.$el = el.content.cloneNode(true) as DocumentFragment;
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

  private localComponents(options: Options<Data>) {
    const { components } = options;
    if (!components) return;
    Object.entries(components).forEach(([name, options]) => {
      this.componentsNames[name.toUpperCase()] = options;
      Array.from(document.querySelectorAll(name)).forEach((node) => {
        this.$components.set(node, new Vuelite(options));
      });
    });
  }

  static globalComponentsNames: Record<string, Options> = {};
  static globalComponents: ComponentMap = new Map();
  static component(name: string, options: Options) {
    this.globalComponentsNames[name.toLocaleUpperCase()] = options;
    Array.from(document.querySelectorAll(name)).forEach((node) => {
      this.globalComponents.set(node, new Vuelite(options));
    });
  }
}

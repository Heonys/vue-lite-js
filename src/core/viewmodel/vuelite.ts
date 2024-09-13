import { createDOMTemplate, node2Fragment } from "@utils/common";
import { type Options } from "./option";
import { injectReactive } from "../reactive/reactive";
import { injectStyleSheet } from "./style";
import { VueScanner } from "../binder/scanner";
import { NodeVisitor } from "../binder/visitor";
import { Lifecycle } from "./lifecycle";

// ※타입 정리
type UpdateQueue = { value: any; updater: (value: any, clone?: Node) => void; target: Node };

export default class Vuelite<D = {}, M = {}, C = {}> extends Lifecycle<D, M, C> {
  el: HTMLElement;
  template?: Element;
  options: Options<D, M, C>;
  virtual: Node;
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
    if (this.updateQueue.length > 0) {
      this.callHook("beforeUpdate");

      const focusedElement = document.activeElement;
      const fragment = node2Fragment(this.el);

      while (this.updateQueue.length > 0) {
        const { target, updater, value } = this.updateQueue.shift();
        const updatedTarget = this.findInClone(fragment, target);
        updater(value, updatedTarget);
      }

      this.el.appendChild(fragment);

      if (focusedElement && focusedElement instanceof HTMLElement) {
        focusedElement.focus();
      }
      this.callHook("updated");
    }
    requestAnimationFrame(() => this.render());
  }

  findInClone(clone: Node, originalTarget: Node): Node | null {
    const walker = document.createTreeWalker(clone, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
    let node: Node | null;

    while ((node = walker.nextNode())) {
      if (node.isEqualNode(originalTarget)) {
        return node;
      }
    }
    return null;
  }
}

import { isDirective } from "@utils/directive";
import { isElementNode, isIncludeText, isTextNode } from "@utils/format";
import Vuelite from "../viewmodel/vuelite";
import { Directive } from "./directive";
import { replaceAlias } from "@/utils/context";

export class Observable {
  constructor(
    public vm: Vuelite,
    public node: Node,
    public contextTask?: Function[],
  ) {
    const patten: RegExp = /{{\s*(.*?)\s*}}/;
    const text = node.textContent;

    if (isElementNode(node)) {
      this.directiveBind(node);
    } else if (isTextNode(node) && patten.test(text) && !isIncludeText(node.parentElement)) {
      this.templateBind(node);
    }
  }

  directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (isDirective(name)) {
        const global = Vuelite.context || {};
        value = replaceAlias(global, value);
        new Directive(name, this.vm, el, value, this.contextTask);
      }
    });
  }
  templateBind(node: Node) {
    let exp = node.textContent;
    const global = Vuelite.context || {};
    exp = replaceAlias(global, exp);
    new Directive("v-text", this.vm, node, exp);
  }
}

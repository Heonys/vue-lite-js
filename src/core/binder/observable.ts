import { extractTemplate, isDirective } from "@utils/directive";
import { isElementNode, isIncludeText, isTextNode } from "@utils/format";
import Vuelite from "../viewmodel/vuelite";
import { Directive } from "./directive";

export class Observable {
  constructor(
    public vm: Vuelite,
    public node: Node,
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
        new Directive(name, this.vm, el, value);
      }
    });
  }
  templateBind(node: Node) {
    extractTemplate(node.textContent).forEach((value) => {
      new Directive("v-text", this.vm, node, value);
    });
  }
}

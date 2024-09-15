import { isDirective } from "@utils/directive";
import { hasTemplate, isElementNode, hasTextDirective, isTextNode } from "@utils/format";
import Vuelite from "../viewmodel/vuelite";
import { Directive } from "./directive";
import { replaceAlias } from "@/utils/context";

export class Observable {
  constructor(
    public vm: Vuelite,
    public node: Node,
    public loopEffects?: Function[],
  ) {
    if (isElementNode(node)) {
      this.directiveBind(node);
    } else if (
      isTextNode(node) &&
      hasTemplate(node.textContent) &&
      !hasTextDirective(node.parentElement)
    ) {
      this.templateBind(node);
    }
  }

  directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (isDirective(name)) {
        const global = Vuelite.context;
        value = replaceAlias(global, value);
        new Directive(name, this.vm, el, value, this.loopEffects);
      }
    });
  }
  templateBind(node: Node) {
    let exp = node.textContent;
    const global = Vuelite.context;
    exp = replaceAlias(global, exp);
    new Directive("v-text", this.vm, node, exp);
  }
}

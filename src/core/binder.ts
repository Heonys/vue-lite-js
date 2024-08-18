import { Vuelite } from "../index";
import { directiveUtils } from "../utils/directive";
import { directives } from "./directive";
import { Observer } from "./observer";
import { updaters } from "./updater";

type DirectiveNames = ["bind", "model", "text", "style", "class", "html", "eventHandler"];
export type DirectiveKey = DirectiveNames[number];

export class Binder {
  constructor(private vm: Vuelite) {}

  directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (directiveUtils.isDirective(name)) {
        const { key, modifier } = directiveUtils.extractDirective(name);

        if (directiveUtils.isEventDirective(name)) {
          directives["eventHandler"](el, this.vm, value, modifier);
        } else {
          directives[key](el, this.vm, value, modifier);
        }
        el.removeAttribute(name);
      }
    });
  }
  templateBind(node: Node) {
    const templateValue = directiveUtils.extractTemplate(node.textContent);
    directives["text"](node, this.vm, templateValue);
  }
}

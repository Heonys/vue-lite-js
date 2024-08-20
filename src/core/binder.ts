import { Vuelite } from "./index";
import {
  extractDirective,
  extractTemplate,
  isDirective,
  isEventDirective,
} from "../utils/directive";
import { directives } from "./directive";

export class Binder {
  constructor(private vm: Vuelite) {}

  directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (isDirective(name)) {
        const { key, modifier } = extractDirective(name);

        if (isEventDirective(name)) {
          directives["eventHandler"](el, this.vm, value, modifier);
        } else {
          directives[key](el, this.vm, value, modifier);
        }
        el.removeAttribute(name);
      }
    });
  }
  templateBind(node: Node) {
    const templateValue = extractTemplate(node.textContent);
    directives["text"](node, this.vm, templateValue);
  }
}

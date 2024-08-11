import { Vuelite } from "../render";
import { processors } from "./processor";

type DirectiveNames = ["bind", "model", "text", "style", "class", "html", "eventHandler"];
export type DirectiveKey = DirectiveNames[number];

export class Directive {
  constructor(private vm: Vuelite) {}

  directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (this.isDirective(name)) {
        const { key, modifier } = this.extractDirective(name);

        if (this.isEventDirective(name)) {
          processors["eventHandler"](el, this.vm, value, modifier);
        } else {
          processors[key](el, this.vm, value, modifier);
        }
      }
    });
  }
  templateBind(node: Node) {
    const exp = this.extractTemplate(node.textContent);
    processors["text"](node, this.vm, exp);
  }

  isDirective(attr: string) {
    return attr.indexOf("v-") === 0;
  }

  isEventDirective(dir: string) {
    return dir.indexOf("v-on") === 0;
  }

  extractDirective(attr: string) {
    const regExp = /^v-(\w+)(:(\w+))?$/;
    const match = attr.match(regExp);
    return { key: match[1] as DirectiveKey, modifier: match[3] || null };
  }

  extractTemplate(text: string) {
    const regExp = /{{\s*(.*?)\s*}}/;
    const match = regExp.exec(text);
    return match ? match[1] : null;
  }
}

import { Vuelite } from "../index";
import { directives } from "./directive";
import { Observer } from "./observer";

type DirectiveNames = ["bind", "model", "text", "style", "class", "html", "eventHandler"];
export type DirectiveKey = DirectiveNames[number];

export class Binder {
  constructor(private vm: Vuelite) {}

  directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (this.isDirective(name)) {
        const { key, modifier } = this.extractDirective(name);

        if (this.isEventDirective(name)) {
          directives["eventHandler"](el, this.vm, value, modifier);
        } else {
          const render = directives[key];
          render(el, this.vm, value, modifier);
          // new Observer(el, this.vm, value, render);
        }
        el.removeAttribute(name);
      }
    });
  }
  templateBind(node: Node) {
    const templateValue = this.extractTemplate(node.textContent);
    const render = directives["text"];
    render(node, this.vm, templateValue);
    new Observer(node, this.vm, templateValue, render);
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

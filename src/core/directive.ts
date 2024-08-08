const DirectiveNames = ["bind", "model", "text", "style", "class", "html", "eventHandler"] as const;
type DirectiveKey = (typeof DirectiveNames)[number];

type DirectiveMethodType = {
  [K in DirectiveKey]: {
    (node: Node, vm: any, modifier: string, exp: string): void;
  };
};

class DirectiveMethod implements DirectiveMethodType {
  bind() {}
  model() {}
  text() {}
  style() {}
  class() {}
  html() {}
  eventHandler() {}
}

export class Directive {
  static methods = new DirectiveMethod();

  static directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (this.isDirective(name)) {
        const { key, modifier } = this.extractDirective(name);

        if (this.isEventDirective(name)) {
          this.methods["eventHandler"]();
        } else {
          this.methods[key]();
        }
      }
    });
  }
  static templateBind(el: Node) {
    const exp = this.extractTemplate(el.textContent);
    this.methods["text"]();
  }

  static isDirective(attr: string) {
    return attr.indexOf("v-") === 0;
  }

  static isEventDirective(dir: string) {
    return dir.indexOf("v-on") === 0;
  }

  static isElementNode(node: Node): node is HTMLElement {
    return node.nodeType === 1;
  }

  static isTextNode(node: Node) {
    return node.nodeType === 3;
  }

  static extractDirective(attr: string) {
    const regExp = /^v-(\w+)(:(\w+))?$/;
    const match = attr.match(regExp);
    return { key: match[1] as DirectiveKey, modifier: match[3] || null };
  }

  static extractTemplate(text: string) {
    const regExp = /{{\s*(.*?)\s*}}/;
    const match = regExp.exec(text);
    return match ? match[1] : null;
  }
}

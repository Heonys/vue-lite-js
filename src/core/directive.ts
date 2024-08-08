import { ViewModel } from "./viewmodel";

const DirectiveNames = ["bind", "model", "text", "style", "class", "html", "eventHandler"] as const;

type DirectiveMethodType = {
  [K in (typeof DirectiveNames)[number]]: {
    (node: Node, vm: ViewModel): void;
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
  static directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (this.isDirective(name)) {
        const dirKey = this.extractDirective("directive", name);
        const dirValue = value;
        const dirModifier = this.extractDirective("modifier", name);

        /* 
        
        디렉티브 처리
        ex) v-model:value = "contents"
        디렉티브 이름 :  model
        디렉티브 식별자 : value
        디렉티브 값 : contents

        템플릿  처리 
        {{ title }} -> v-text = "title" 으로 변환 
        디렉티브 이름 :  text
        디렉티브 식별자 : null
        디렉티브 값 : title


        */
      }
    });
  }
  static templateBind(el: Node) {
    const templateKey = this.extractTemplate(el.textContent);
    //  text 디렉티브로 처리
  }

  static isDirective(attr: string) {
    return attr.indexOf("v-") === 0;
  }

  static isEventDirective(dir: string) {
    return dir.indexOf("on") === 0;
  }

  static isElementNode(node: Node): node is HTMLElement {
    return node.nodeType === 1;
  }

  static isTextNode(node: Node) {
    return node.nodeType === 3;
  }

  static extractDirective(type: "directive" | "modifier", attr: string) {
    const regExp = /^v-(\w+)(:(\w+))?$/;
    const match = attr.match(regExp);
    if (type === "directive") return match[1];
    else return match[3] || null;
  }

  static extractTemplate(text: string) {
    const regExp = /{{\s*(.*?)\s*}}/;
    const match = regExp.exec(text);
    return match ? match[1] : null;
  }
}

import { Vuelite } from "../render";

const DirectiveNames = ["bind", "model", "text", "style", "class", "html", "eventHandler"] as const;
type DirectiveKey = (typeof DirectiveNames)[number];

export class Directive {
  private methods;

  constructor(private vm: Vuelite) {
    this.methods = new DirectiveMethod();
  }

  directiveBind(el: Element) {
    const vm = this.vm;
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (this.isDirective(name)) {
        const { key, modifier } = this.extractDirective(name);

        if (this.isEventDirective(name)) {
          this.methods["eventHandler"](el, vm, value, modifier);
        } else {
          this.methods[key](el, vm, value, modifier);
        }
      }
    });
  }
  templateBind(el: Node) {
    const exp = this.extractTemplate(el.textContent);
    this.methods["text"](el, this.vm, exp);
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

/* 
⭐⭐⭐
프로세서를 추상 클래스로 만들어서 이를 상속받는 bind, model, style 등의 구현 프로세서 만들기 

*/
interface Processor {}

type DirectiveMethodType = {
  [K in DirectiveKey]: {
    (node: Node, vm: Vuelite, exp: string, modifier?: string, processor?: Processor): void;
  };
};

class DirectiveMethod implements DirectiveMethodType {
  text(node: Node, vm: Vuelite, exp: string) {
    // 텍스트 노드 변경을 위한 프로세서 추가
    this.bind(node, vm, exp);
  }
  bind(node: Node, vm: Vuelite, exp: string, modifier?: string) {
    // 단반향 바인딩
  }
  model(node: Node, vm: Vuelite, exp: string, modifier?: string) {
    // 양방향 바인딩
  }
  style(node: Node, vm: Vuelite, exp: string, modifier?: string) {
    // 스타일 변경을 위한 프로세서 추가
    this.bind(node, vm, exp);
  }
  class(node: Node, vm: Vuelite, exp: string, modifier?: string) {
    // 클래스 변경을 위한 프로세서 추가
    this.bind(node, vm, exp);
  }
  html(node: Node, vm: Vuelite, exp: string, modifier?: string) {
    // innerHTML을 통한 HTML 주입을 위한 프로세서 추가
    this.bind(node, vm, exp);
  }
  eventHandler(node: Node, vm: Vuelite, exp: string, modifier: string) {}
}

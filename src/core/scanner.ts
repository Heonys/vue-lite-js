import { Binder, BinderItem } from "./binder";
import { DomVisitor, Visitor } from "./visitor";

export class Scanner {
  constructor(private visitor: Visitor) {
    this.visitor = visitor;
  }
  visit(action: Function, target: any) {
    this.visitor.visit(action, target);
  }
  scan(target: any) {
    throw "use override";
  }
}

export class DomScanner extends Scanner {
  static templates = new Map<string, HTMLElement>();
  static get(key: string) {
    return this.templates.get(key);
  }
  constructor(visitor: DomVisitor) {
    super(visitor);
  }

  scan(el: HTMLElement) {
    const binder = new Binder();

    const action = (el: HTMLElement) => {
      const template = el.getAttribute("data-template");
      if (template) {
        el.removeAttribute("data-template");
        DomScanner.templates.set(template, el);
        // Map { listItem -> <li data-viewmodel="item"></li> }
        el.remove(); // template은 진짜 요소가 아닌 element를 묶기위한 용도이니까 부모에서 제거
      } else {
        const vm = el.getAttribute("data-viewmodel");
        if (vm) {
          el.removeAttribute("data-viewmodel");
          binder.add(new BinderItem(el, vm));
        }
      }
    };

    action(el);
    this.visit(action, el);
    return binder;
  }
}

// TODO: data-viewmodel 속성 v-model 또는 v:key 이런식으로 바인딩 하도록 바꾸기
class VueScanner extends Scanner {
  // vue 문법으로 작성된 템플릿을 파싱하는 코드가 필요
  // + 해당 스캐너에 전달받는 Vue Visitor또한 필요
}

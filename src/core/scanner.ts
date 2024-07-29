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
  constructor(visitor: DomVisitor) {
    super(visitor);
  }

  scan(el: HTMLElement) {
    const binder = new Binder();
    const action = (el: HTMLElement) => {
      const vm = el.getAttribute("data-viewmodel");
      if (vm) binder.add(new BinderItem(el, vm));
    };
    action(el);
    this.visit(action, el);
    return binder;
  }
}

class DomVueScanner extends Scanner {
  // vue 문법으로 작성된 템플릿을 파싱하는 코드가 필요
  // + 해당 스캐너에 전달받는 Vue Visitor또한 필요
}

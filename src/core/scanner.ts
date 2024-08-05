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

export class VueScanner extends Scanner {
  static vBind = new Map<string, HTMLElement>();
  static templatePtn: RegExp = /{{\s*(.*?)\s*}}/;

  static extractReg(text: string) {
    const pattern = this.templatePtn;
    const match = pattern.exec(text);
    return match ? match[1] : null;
  }

  constructor(visitor: DomVisitor) {
    super(visitor);
  }

  scan(el: HTMLElement) {
    const binder = new Binder();
    const action = (el: HTMLElement) => {
      if (el.childNodes.length === 1 && VueScanner.templatePtn.test(el.textContent)) {
        VueScanner.vBind.set(VueScanner.extractReg(el.textContent), el);
      }
      const vmKey = el.getAttribute("v-model");
      if (vmKey) {
        el.removeAttribute("v-model");
        binder.add(new BinderItem(el, vmKey));
      }
    };

    action(el);
    this.visit(action, el);
    return binder;
  }
}

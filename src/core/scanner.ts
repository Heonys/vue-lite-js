import { extractReg } from "../utils/index";
import { Binder, BinderItem } from "./binder";
import { Directive } from "./directive";
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

  constructor(visitor: DomVisitor) {
    super(visitor);
  }

  scan(el: HTMLElement) {
    const binder = new Binder();
    const patten = VueScanner.templatePtn;

    const action = (el: HTMLElement) => {
      // {{ data }} 형태의 단방향 데이터 바인딩을 찾아냄
      if (el.childNodes.length === 1 && patten.test(el.textContent)) {
        VueScanner.vBind.set(extractReg(patten, el.textContent), el);
      }

      // 일단 디렉티브 축약형태 지우고 -> 디렉티브 키 가져오기 v-bind:text="text"
      // v-model할때 예시 보기 -> input text면 value고, input checkbox이면 checked인데

      const directiveMap = Directive.getDirectiveMap(el);

      if (directiveMap) {
        Object.entries(directiveMap).forEach(([key, value]) => {
          // 지우는걸 어느시점에 해야되나
          el.removeAttribute(`v-${key}`);
          binder.add(new BinderItem(el, value.key, value.modifier, value.value));
        });
      }
    };

    action(el);
    this.visit(action, el);
    return binder;
  }
}

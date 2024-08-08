import { extractReg } from "../utils/index";
import { Binder, ViewItem } from "./binder";
import { Directive } from "./directive";
import { ViewModel } from "./viewmodel";
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
  static templatePtn: RegExp = /{{\s*(.*?)\s*}}/;
  static binderItemMap = new Map<HTMLElement, ViewItem>();

  constructor(visitor: DomVisitor) {
    super(visitor);
  }

  scan(el: HTMLElement) {
    const binder = new Binder();
    const patten = VueScanner.templatePtn;

    const action = (el: HTMLElement) => {
      let isTemplate = false;

      // 템플릿 item 생성
      if (el.childNodes.length === 1 && patten.test(el.textContent)) {
        ViewModel.UID++;
        el.uid = ViewModel.UID;
        isTemplate = true;

        const templateKey = extractReg(patten, el.textContent);
        const property = {
          directive: "",
          modifier: "",
          directiveValue: "",
          template: templateKey,
        };
        const binderItem = new ViewItem(el, "reactive", property);
        binder.add(binderItem);
        VueScanner.binderItemMap.set(el, binderItem);
      }

      const directiveMap = Directive.getDirectiveMap(el);

      // 디렉티브 item 생성
      if (directiveMap) {
        if (!isTemplate) ViewModel.UID++;
        Object.entries(directiveMap).forEach(([key, value]) => {
          el.removeAttribute(`v-${key}`);
          el.uid = ViewModel.UID;

          const property = {
            directive: value.key,
            modifier: value.modifier,
            directiveValue: value.value,
          };

          const binderItem = new ViewItem(el, "reactive", property);
          binder.add(binderItem);
          VueScanner.binderItemMap.set(el, binderItem);
        });
      }

      // 템플릿 문법도 없고 디렉티브도 없는 정말 정적인 엘리먼트역시 item 생성
      if (!VueScanner.binderItemMap.has(el)) {
        ViewModel.UID++;
        el.uid = ViewModel.UID;

        const binderItem = new ViewItem(el, "static");
        binder.add(binderItem);
        VueScanner.binderItemMap.set(el, binderItem);
      }
    };

    const binderItem = new ViewItem(el, "root");
    binder.add(binderItem);
    VueScanner.binderItemMap.set(el, binderItem);
    this.visit(action, el);

    // binderItem의 부모자식 관계 설정
    VueScanner.binderItemMap.forEach((binderItem, element) => {
      let parent = element.parentElement;
      while (parent) {
        if (VueScanner.binderItemMap.has(parent)) {
          binderItem.parent = VueScanner.binderItemMap.get(parent);
          binderItem.parent.children.push(binderItem);
          break;
        }
        parent = parent.parentElement;
      }
    });

    return binder;
  }
}

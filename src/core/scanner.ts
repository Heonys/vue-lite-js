import { Binder, ViewItem } from "./binder";
import { Directive } from "./directive";
import { ViewModel } from "./viewmodel";
import { Visitor } from "./visitor";

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

/* 
⭐
Scanner의 역할 -> 
1) Dom에서 템플릿 및 디렉티브와 같은 것들을 파싱 (Visitor에게 순회에 대한 책임은 전가)
2) 초기페이지 렌더링? 

.🚩수정할 것  
1. Scanner의 역할 분리 
2. 최적화를 위해 fragment 활용 


*/

export class VueScanner2 extends Scanner {
  fragment: DocumentFragment;

  constructor(visitor: Visitor) {
    super(visitor);
  }

  node2Fragment(el: HTMLElement) {
    const fragment = document.createDocumentFragment();
    let child: Node;
    while ((child = el.firstChild)) fragment.appendChild(child);
    return (this.fragment = fragment);
  }

  scan(el: HTMLElement) {
    const binder = new Binder();
    const { isElementNode, isTextNode } = Directive;

    const action = (node: Node) => {
      const text = node.textContent;
      if (isElementNode(node)) {
        Directive.directiveBind(node);
      } else if (isTextNode(node) && VueScanner.templatePtn.test(text)) {
        Directive.templateBind(node);
      }
    };

    this.node2Fragment(el);
    action(this.fragment);
    this.visit(action, this.fragment);
    el.appendChild(this.fragment);
  }
}

/* 

--------------------------------------------------------------------------------------------
*/

export class VueScanner extends Scanner {
  static templatePtn: RegExp = /{{\s*(.*?)\s*}}/;
  static binderItemMap = new Map<HTMLElement, ViewItem>();
  fragment: DocumentFragment;

  constructor(visitor: Visitor) {
    super(visitor);
  }

  // fragment를 통해 DOM을 직접 조작하지 않고 변경 사항을 메모리에서 처리하여 렌더링 성능을 최적화함
  node2Fragment(el: HTMLElement) {
    const fragment = document.createDocumentFragment();
    let child: Node;
    while ((child = el.firstChild)) fragment.appendChild(child);
    return (this.fragment = fragment);
  }

  // scan(el: HTMLElement) {
  //   const binder = new Binder();
  //   const patten = VueScanner.templatePtn;

  //   this.node2Fragment(el);
  //   /*
  //     💡 -> 이 사이에 el을 직접 컨트롤하는게 아닌 fragment로 컨트롤
  //   */
  //   el.appendChild(this.fragment);

  //   const action = (el: HTMLElement) => {
  //     let isTemplate = false;

  //     // 템플릿 item 생성
  //     if (el.childNodes.length === 1 && patten.test(el.textContent)) {
  //       ViewModel.UID++;
  //       el.uid = ViewModel.UID;
  //       isTemplate = true;

  //       const templateKey = extractReg(patten, el.textContent);
  //       const property = {
  //         directive: "",
  //         modifier: "",
  //         directiveValue: "",
  //         template: templateKey,
  //       };
  //       const binderItem = new ViewItem(el, "reactive", property);
  //       binder.add(binderItem);
  //       VueScanner.binderItemMap.set(el, binderItem);
  //     }

  //     const directiveMap = Directive.getDirective(el);

  //     // 디렉티브 item 생성
  //     if (directiveMap) {
  //       if (!isTemplate) ViewModel.UID++;
  //       Object.entries(directiveMap).forEach(([key, value]) => {
  //         el.removeAttribute(`v-${key}`);
  //         el.uid = ViewModel.UID;

  //         const property = {
  //           directive: value.key,
  //           modifier: value.modifier,
  //           directiveValue: value.value,
  //         };

  //         const binderItem = new ViewItem(el, "reactive", property);
  //         binder.add(binderItem);
  //         VueScanner.binderItemMap.set(el, binderItem);
  //       });
  //     }

  //     // 템플릿 문법도 없고 디렉티브도 없는 정말 정적인 엘리먼트역시 item 생성
  //     if (!VueScanner.binderItemMap.has(el)) {
  //       ViewModel.UID++;
  //       el.uid = ViewModel.UID;

  //       const binderItem = new ViewItem(el, "static");
  //       binder.add(binderItem);
  //       VueScanner.binderItemMap.set(el, binderItem);
  //     }
  //   };

  //   const binderItem = new ViewItem(el, "root");
  //   binder.add(binderItem);
  //   VueScanner.binderItemMap.set(el, binderItem);
  //   this.visit(action, el);

  //   // binderItem의 부모자식 관계 설정
  //   VueScanner.binderItemMap.forEach((binderItem, element) => {
  //     let parent = element.parentElement;
  //     while (parent) {
  //       if (VueScanner.binderItemMap.has(parent)) {
  //         binderItem.parent = VueScanner.binderItemMap.get(parent);
  //         binderItem.parent.children.push(binderItem);
  //         break;
  //       }
  //       parent = parent.parentElement;
  //     }
  //   });

  //   return binder;
  // }
}

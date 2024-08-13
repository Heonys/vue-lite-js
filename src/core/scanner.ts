import { Vuelite } from "../index";
import { isElementNode, isIncludeText, isTextNode } from "../utils/index";
import { Binder } from "./binder";
import { Visitor } from "./visitor";

export class Scanner {
  constructor(private visitor: Visitor) {}
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

export class VueScanner extends Scanner {
  private fragment: DocumentFragment;

  scan(vm: Vuelite) {
    const patten: RegExp = /{{\s*(.*?)\s*}}/;
    const binder = new Binder(vm);

    const action = (node: Node) => {
      const text = node.textContent;
      if (isElementNode(node)) {
        binder.directiveBind(node);
      } else if (isTextNode(node) && patten.test(text) && !isIncludeText(node.parentElement)) {
        binder.templateBind(node);
      }
    };

    this.node2Fragment(vm.el);
    action(this.fragment);
    this.visit(action, this.fragment);
    vm.el.appendChild(this.fragment);

    return binder;
  }

  private node2Fragment(el: HTMLElement) {
    const fragment = document.createDocumentFragment();
    let child: Node;
    while ((child = el.firstChild)) fragment.appendChild(child);
    return (this.fragment = fragment);
  }
}

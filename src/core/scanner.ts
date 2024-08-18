import { Binder, Vuelite } from "./index";
import { isElementNode, isIncludeText, isTextNode } from "../utils/format";
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

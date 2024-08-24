import { Vuelite, Observable } from "./index";
import type { Visitor } from "./visitor";
import { isReactiveNode } from "../utils/directive";

abstract class Scanner {
  constructor(private visitor: Visitor) {}
  visit(action: Function, target: any) {
    this.visitor.visit(action, target);
  }
  abstract scan(target: any): void;
}

export class VueScanner extends Scanner {
  private fragment: DocumentFragment;

  private node2Fragment(el: HTMLElement) {
    const fragment = document.createDocumentFragment();
    let child: Node;
    while ((child = el.firstChild)) fragment.appendChild(child);
    this.fragment = fragment;
  }

  scan(vm: Vuelite) {
    const action = (node: Node) => {
      isReactiveNode(node) && new Observable(vm, node);
    };
    this.node2Fragment(vm.el);
    action(this.fragment);
    this.visit(action, this.fragment);
    vm.el.appendChild(this.fragment);
  }
}

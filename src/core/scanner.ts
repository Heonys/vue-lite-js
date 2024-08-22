import { Vuelite } from "./index";
import { Visitor } from "./visitor";
import { Observable } from "./observable";

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
    const action = (node: Node) => new Observable(vm, node);

    this.node2Fragment(vm.el);
    action(this.fragment);
    this.visit(action, this.fragment);
    vm.el.appendChild(this.fragment);
  }

  private node2Fragment(el: HTMLElement) {
    const fragment = document.createDocumentFragment();
    let child: Node;
    while ((child = el.firstChild)) fragment.appendChild(child);
    return (this.fragment = fragment);
  }
}

import { node2Fragment } from "@/utils/common";
import Vuelite from "../viewmodel/vuelite";
import { Observable } from "./observable";
import type { Visitor } from "./visitor";
import { isReactiveNode } from "@utils/directive";
import { isNonStandard } from "@/utils/format";

abstract class Scanner {
  constructor(private visitor: Visitor) {}
  visit(action: Function, target: any) {
    this.visitor.visit(action, target);
  }
  abstract scan(target: any): void;
}

export class VueScanner extends Scanner {
  private fragment: DocumentFragment;

  scan(vm: Vuelite) {
    const action = (node: Node) => {
      if (isNonStandard(node)) {
        const tagName = node.tagName.toLowerCase();
        vm.$coponents[tagName] = node;
        const clone = Vuelite.globalComponents[tagName].$el.cloneNode(true);
        node.parentNode?.replaceChild(clone, node);
      } else {
        isReactiveNode(vm, node) && new Observable(vm, node);
      }
    };

    this.fragment = node2Fragment(vm.$el);
    action(this.fragment);
    this.visit(action, this.fragment);
    vm.$el.appendChild(this.fragment);
    vm.clearTasks();
  }

  scanPartial(vm: Vuelite, el: HTMLElement, loopEffects: Function[]) {
    const container = node2Fragment(el);
    const action = (node: Node) => {
      isReactiveNode(vm, node) && new Observable(vm, node, loopEffects);
    };
    action(container);
    this.visit(action, container);
    el.appendChild(container);
    return el;
  }
}

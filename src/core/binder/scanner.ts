import { node2Fragment } from "@/utils/common";
import Vuelite from "../viewmodel/vuelite";
import { Observable } from "./observable";
import type { Visitor } from "./visitor";
import { checkObserverType } from "@utils/directive";
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
        this.replaceComponent(vm, node);
      }
      const obserberType = checkObserverType(vm, node);
      if (obserberType) new Observable(vm, node, obserberType);
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
      if (isNonStandard(node)) {
        this.replaceComponent(vm, node, loopEffects);
      }
      const obserberType = checkObserverType(vm, node);
      if (obserberType) new Observable(vm, node, obserberType, loopEffects);
    };
    action(container);
    this.visit(action, container);
    el.appendChild(container);
    return el;
  }

  private replaceComponent(vm: Vuelite, el: HTMLElement, task?: Function[]) {
    const childVM = vm.$components.get(el) || Vuelite.globalComponents.get(el);
    if (childVM) {
      vm.deferredTasks.push(() => el.parentNode?.replaceChild(childVM.$el, el));
      el.isComponent = true;
    } else {
      const option = vm.componentsNames[el.tagName] || Vuelite.globalComponentsNames[el.tagName];
      if (option) {
        el.isComponent = true;
        const childVM = new Vuelite(option);
        if (vm.componentsNames[el.tagName]) {
          vm.$components.set(el, childVM);
        } else {
          Vuelite.globalComponents.set(el, childVM);
        }
        const fn = () => el.parentNode?.replaceChild(childVM.$el, el);
        if (task) task.push(fn);
        else vm.deferredTasks.push(fn);
      }
    }
  }
}

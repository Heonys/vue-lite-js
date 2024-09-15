import Vuelite from "../viewmodel/vuelite";
import { Observer } from "../reactive/observer";

export class Condition {
  parent: HTMLElement;
  childIndex: number;
  ifFragment: DocumentFragment;
  elseFragment?: DocumentFragment;
  elseElement?: HTMLElement;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {
    this.parent = el.parentElement || vm.el;
    this.childIndex = Array.from(this.parent.children).indexOf(el);
    this.ifFragment = document.createDocumentFragment();
    this.checkForElse();
    this.render();
  }

  render() {
    new Observer(this.vm, this.exp, (newVal, oldVal) => {
      this.updater(newVal);
    });
  }

  checkForElse() {
    const silbling = this.el.nextElementSibling;
    if (silbling?.hasAttribute("v-else")) {
      this.elseElement = silbling as HTMLElement;
      this.elseFragment = document.createDocumentFragment();
    }
  }

  updater(value: any) {
    // updater가 발생하면 value가 어떻게 평가되는지에 따라 가시 상태가 반전됨
    if (value) {
      // Show v-if, hide v-else
      const ref = this.parent.children[this.childIndex];
      this.parent.insertBefore(this.ifFragment, ref);
      if (this.elseElement) this.elseFragment.appendChild(this.elseElement);
    } else {
      // Hide v-if, show v-else
      this.ifFragment.appendChild(this.el);
      if (this.elseElement) {
        const ref = this.parent.children[this.childIndex];
        this.parent.insertBefore(this.elseFragment, ref);
      }
    }
  }
}

import { safeEvaluate } from "@/utils/evaluate";
import Vuelite from "../viewmodel/vuelite";
import { createDOMTemplate } from "@/utils/common";

export class Condition {
  html: string;
  parent: HTMLElement;
  childIndex: number;
  isVisible: boolean;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {
    this.html = el.outerHTML;
    this.parent = el.parentElement;
    this.childIndex = Array.from(this.parent.children).indexOf(el);
    this.mount();
  }
  mount() {
    const value = safeEvaluate(this.vm, this.exp);
    if (value) {
      this.isVisible = true;
    } else {
      this.isVisible = false;
      this.el.remove();
    }
  }
  updater(value: any) {
    if (value) {
      if (!this.isVisible) {
        this.isVisible = true;
        const referenceElement = Array.from(this.parent.children)[this.childIndex];
        this.parent.insertBefore(createDOMTemplate(this.html), referenceElement);
      }
    } else {
      if (this.isVisible) {
        this.isVisible = false;
        this.el.remove();
      }
    }
  }
}

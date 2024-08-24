import { replaceTemplate } from "../utils/directive";
import { isObject, isQuotedString } from "../utils/format";
import { Directive } from "./index";

/* 
updater란 dep에서 변화를 감지하고 구독자들에게 변화를 알릴때 
전달되는 구체적인 업데이트 함수  
*/

export type Updater = (node: Node, value: any) => void;

export const updaters = {
  text(this: Directive, node: Node, value: string) {
    node.textContent = replaceTemplate(node.textContent, this.exp, value);
  },
  class(el: HTMLElement, value: any) {
    if (isObject(value)) {
      Object.entries(value).forEach(([k, v]) => {
        if (v) el.classList.add(k);
      });
    }
  },
  style(el: HTMLElement, value: object) {
    for (const [k, v] of Object.entries(value)) {
      if (isQuotedString(v)) {
        (el.style as any)[k] = v.slice(1, -1);
      } else {
        (el.style as any)[k] = v;
      }
    }
  },
  html(el: HTMLElement, value: string) {
    el.innerHTML = value;
  },

  inputCheckbox(el: HTMLInputElement, value: any) {
    el.checked = value;
  },
  inputRadio(el: HTMLInputElement, value: any) {
    el.checked = el.value === value;
  },

  inputValue(el: HTMLInputElement, value: any) {
    el.value = value;
  },
  inputMultiple(el: HTMLSelectElement, value: any) {
    const options = Array.from(el.options);
    if (!Array.isArray(value)) return;

    options.forEach((option) => {
      option.selected = value.includes(option.value);
    });
  },
};

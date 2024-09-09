import { isObject, isQuotedString } from "@utils/format";
import { Directive } from "./directive";

export type Updater = (node: Node, value: any) => void;

export const updaters = {
  text(this: Directive, node: Node, value: string) {
    node.textContent = value;
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
  customBind(this: Directive, el: HTMLElement, value: any) {
    // (el as any)[this.modifier] = value;
    value && el.setAttribute(this.modifier, value);
  },
  objectBind(this: Directive, el: HTMLInputElement, value: any) {
    if (isObject(value)) {
      Object.entries(value).forEach(([k, v]) => el.setAttribute(k, v));
    }
  },
  show(el: HTMLElement, condition: any) {
    if (condition) el.style.display = "";
    else el.style.display = "none";
  },
};

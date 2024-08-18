import { DirectiveKey } from "./binder";

type UpdaerKeys = Exclude<DirectiveKey, "eventHandler"> | "customBind";

export const updaters: {
  [Method in UpdaerKeys]: (el: Node, value: any, modifier?: string) => void;
} = {
  text(el: HTMLElement, value: any) {
    el.textContent = value;
  },
  bind(el, value) {},
  customBind(el: HTMLElement, value, modifier) {
    if (el.hasAttribute(modifier)) el.setAttribute(modifier, value);
  },
  model(el, value) {},
  class(el, value) {},
  html(el, value) {},
  style(el, value) {},
};

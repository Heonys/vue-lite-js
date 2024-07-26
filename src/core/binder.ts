import ViewModel from "./viewmodel";

interface CustomElement extends HTMLElement {
  [key: string]: any;
}

export class Binder {
  private items = new Set<BinderItem>();
  add(item: BinderItem) {
    this.items.add(item);
  }
  render(viewmodel: ViewModel) {
    this.items.forEach((item) => {
      const vm = viewmodel[item.viewmodelKey];
      if (!(vm instanceof ViewModel)) return;
      const el = item.el;
      Object.entries(vm.styles).forEach(([k, v]) => (el.style[k as any] = v));
      Object.entries(vm.attribute).forEach(([k, v]) => el.setAttribute(k, v));
      Object.entries(vm.properties).forEach(([k, v]) => ((el as CustomElement)[k] = v));
      Object.entries(vm.events).forEach(
        ([k, v]) => ((el as CustomElement)["on" + k] = (e: Event) => v.call(el, e, viewmodel)),
      );
    });
  }
}

export class BinderItem {
  constructor(
    public el: HTMLElement,
    public viewmodelKey: string, // lazy binding
  ) {
    this.el = el;
    this.viewmodelKey = viewmodelKey;
    Object.freeze(this);
  }
}

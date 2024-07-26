import { Binder, BinderItem } from "./binder";

export class Scanner {
  scan(el: HTMLElement) {
    const binder = new Binder();
    this.checkItem(binder, el);

    const stack: HTMLElement[] = [el.firstElementChild as HTMLElement];
    let target: HTMLElement;

    while ((target = stack.pop())) {
      this.checkItem(binder, target);
      if (target.firstElementChild) stack.push(target.firstElementChild as HTMLElement);
      if (target.nextElementSibling) stack.push(target.nextElementSibling as HTMLElement);
    }

    return binder;
  }
  checkItem(binder: Binder, el: HTMLElement) {
    const vm = el.getAttribute("data-viewmodel");
    if (vm) binder.add(new BinderItem(el, vm));
  }
}

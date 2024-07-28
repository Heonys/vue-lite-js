import type { ViewModel } from "./viewmodel";

export abstract class Processor {
  constructor(public category: string) {
    this.category = category;
    Object.freeze(this);
  }

  process(vm: ViewModel, el: HTMLElement, key: string, value: any) {
    this._process(vm, el, key, value);
  }
  abstract _process(vm: ViewModel, el: HTMLElement, key: string, value: any): any;
}

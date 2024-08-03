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

// vue 혹은 react 프로세서를 추가해서 파싱한다?
// -> index에서 바로 사용하게 코드 분리

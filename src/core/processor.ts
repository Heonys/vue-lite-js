import { WritableKeys } from "../types/index";
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

// 프로세서란 ->
// 프로세서를 만들때 전달한 [카테고리]를 키로 갖는 process 함수를 전달하고
// addProcessor를 통해서 바인더에서 processors라는 컬렉션에 등록됨
// 이후에 notify가 되어 updated된 알림이 왔을때 바인더에서
// processor를 순회하면서 알림으로 온 카데고리를 업데이트 -> 즉, 그타이밍에 _process 함수 실행되어 업데이트

// 쉽게말해 해당 vm안에 styles라는 속성이 존재하면 styles 프로세서의 process가 실행되는 것

export const baseProcessor = [
  new (class extends Processor {
    _process(vm: ViewModel, el: HTMLElement, key: any, value: any): void {
      el.style[key] = value;
    }
  })("styles"),
  new (class extends Processor {
    _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
      el.setAttribute(key, value);
    }
  })("attribute"),
  new (class extends Processor {
    _process(vm: ViewModel, el: HTMLElement, key: WritableKeys<HTMLElement>, value: any): void {
      (el[key] as any) = value;
    }
  })("properties"),
  new (class extends Processor {
    _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
      (el[("on" + key) as WritableKeys<HTMLElement>] as any) = (e: Event) => value.call(el, e, vm);
    }
  })("events"),
];

/* 
v-model, v-bind, v-on의 경우 디렉티브키와 식별자 값이 필요

반면 v-styles, v-text의 경우는 value만 필요 




v-style) ->  
v-text) -> properties의 innerHTML으로 변경해주면됨 


*/

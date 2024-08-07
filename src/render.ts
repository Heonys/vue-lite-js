import { VueScanner, DomVisitor, Binder, ViewModel } from "./core/index";
import { baseProcessor } from "./core/processor";

interface Options {
  el: string;
  data?: object;
  mothod?: {
    [K: string]: (...args: any[]) => void;
  };
  computed?: {}; // 대기
  watch?: {};
  styles?: {
    [K: string]: any;
  };
  events?: {};
}

class OptionParser {
  static parse(options: Options): ViewModel {
    const baseModel = {};

    /* 
    스캐너에서 읽은 모든 디렉티브 value값은 새로운 뷰모델을 만들어야함
    단, 하나의 elemnet가 여러개의 디렉티브를 가지면 하나의 뷰모델 내부에서 속성이 추가되면됨 

    uuid를 준다? 

    <input type="text" v-model="text" v-style="textStyle" v-on:input="hanldeInput">
    예외적으로 v-style은 스타일 속성에 따로 정의
    

    */
    return ViewModel.get({
      "1": ViewModel.get({
        styles: {
          width: "50%",
          background: "#ffa",
          cursor: "pointer",
        },
        events: {
          click(e: Event, vm: ViewModel) {},
        },
      }),
      "2": ViewModel.get({
        properties: {
          innerHTML: "Title",
        },
      }),
      "3": ViewModel.get({
        properties: {
          innerHTML: "Contents01",
        },
      }),
      "4": ViewModel.get({
        properties: {
          value: "hello",
        },

        // TODO: 이거 데이터들을 전부 한곳에 모아두고 거기서 바꾸는 걸로 해야할듯 (경로 문제)
        // 실제 DOM이 변경되었을때 VM도 갱신해주는 부분
        events: {
          input(e: InputEvent, vm: ViewModel) {
            const target = e.target as HTMLInputElement;
            vm.parent["4"].properties.value = target.value;
          },
        },
      }),
    });
  }
}

export class Vuelite {
  el: HTMLElement;
  options: Options;

  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;

    const viewmodel = OptionParser.parse(options);
    new VueliteBinder(this.el, viewmodel);
  }
}

export default class VueliteBinder {
  private binder: Binder;

  static setBaseProcessor(binder: Binder) {
    baseProcessor.forEach((process) => binder.addProcessor(process));
    return binder;
  }

  constructor(
    private el: HTMLElement,
    private vm: ViewModel,
  ) {
    const visitor = new DomVisitor();
    const scanner = new VueScanner(visitor);
    this.binder = scanner.scan(this.el);
    VueliteBinder.setBaseProcessor(this.binder);
    this.binder.watch(this.vm);
  }
}

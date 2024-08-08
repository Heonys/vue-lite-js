import { ViewItem } from "./core/binder";
import { Directive } from "./core/directive";
import { VueScanner, DomVisitor, Binder, ViewModel } from "./core/index";
import { baseProcessor } from "./core/processor";
import { VueScanner2 } from "./core/scanner";
import { NodeVisitor } from "./core/visitor";

interface Options {
  el: string;
  data?: object;
  mothod?: {
    [K: string]: (...args: any[]) => void;
  };
  computed?: {};
  watch?: {};
  styles?: {
    [K: string]: any;
  };
  events?: {};
}

export class OptionParser {
  static parse(options: Options, binderItems: ViewItem[]): ViewModel {
    /* 

    우선 items에 있는 모든 reactive한 값들은 전부 
    
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
      "5": ViewModel.get({
        styles: {
          color: "#FF0000",
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

    // const scanner = new VueScanner(new DomVisitor());
    // const binder = scanner.scan(this.el);

    const scanner2 = new VueScanner2(new NodeVisitor());
    const binder2 = scanner2.scan(this.el);

    //  ⭐⭐⭐
    // 1. 일단 옵션 데이터 정제하기
    // 2. 프록시 설정
    // 3. 뷰모델 생성
    // 4. binder에 뷰모델 바인딩

    // const viewmodel = OptionParser.parse(options, [...binder.binderItems]);
    // new VueliteBinder(binder, viewmodel);
  }
}

export default class VueliteBinder {
  static setBaseProcessor(binder: Binder) {
    baseProcessor.forEach((process) => binder.addProcessor(process));
    return binder;
  }

  constructor(
    private binder: Binder,
    private vm: ViewModel,
  ) {
    VueliteBinder.setBaseProcessor(this.binder);
    this.binder.watch(this.vm);
  }
}

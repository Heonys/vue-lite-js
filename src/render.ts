import { ViewItem } from "./core/binder";
import { VueScanner, DomVisitor, Binder, ViewModel } from "./core/index";
import { baseProcessor } from "./core/processor";

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
    console.log(binderItems);

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

    const scanner = new VueScanner(new DomVisitor());
    const binder = scanner.scan(this.el);

    /* 
    ⭐⭐⭐
    아냐 일단, option객체를 파싱해서 변수로 잡아놓아야함 this._proxy로 했던 것 처럼 
    걔네들은 전부 프록시로 반응성을 주입해야함 (MVVM 코드 참조)



    -> 이 시점에 dom에 대한 viewItem 전부 생성
    
    이후에 프록시로 상태에 대한 변화를 감지하고 Observable, Listener를 통해 binder에서 처리 

    이후에 option객체를 파싱해서 viewmodel에 적용하여 최종적인 viewmodel을 생성 

    -> 그러면 최종 뷰모델을 만든상태에서 proxy가 됬건 반응성을 주입해야하는건가? 

    */

    const viewmodel = OptionParser.parse(options, [...binder.binderItems]);
    new VueliteBinder(binder, viewmodel);
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

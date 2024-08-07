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

export class OptionParser {
  static parse(options: Options): ViewModel {
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
    여기서 결국 스캐너를 통해 만든 바인더가 갖고있는 items에는 각가의 element에 해당하는 디렉티브정보를 갖는다
    따라서 이 item을 순회하면서 viewmodel을 만들어야하는데 
    
    근데 뷰모델은 기본적으로 중첩구조를 갖고, 부모자식 관계를 만드는데 
    items가 이전의 뷰모델의 성격을 갖는다? 이상한데

    viemodel의 설계를 처음부터 다시해야하나 (items를 받아서 뷰모델을 생성하는 느낌으로)
    그러면 솔직히 optionPaser이런것도 필요없음 그자체가 viewmodel이기 떄문 

    viewmodel은 items 목록을 받아서 중첩구조의 viewmoel로 만든다? 

    */

    const viewmodel = OptionParser.parse(options);
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

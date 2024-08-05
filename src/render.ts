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

    return ViewModel.get({
      wrapper: ViewModel.get({
        styles: {
          width: "50%",
          background: "#ffa",
          cursor: "pointer",
        },
        events: {
          click(e: Event, vm: ViewModel) {
            const prev = vm.parent.text.properties.value;
            vm.parent.text.properties.value = prev + "0";
          },
        },
      }),
      title: ViewModel.get({
        properties: {
          innerHTML: "Title",
        },
      }),
      contents: ViewModel.get({
        properties: {
          innerHTML: "Contents",
        },
      }),
      text: ViewModel.get({
        properties: {
          value: "hello",
        },

        // TODO: 이거 데이터들을 전부 한곳에 모아두고 거기서 바꾸는 걸로 해야할듯 (경로 문제)
        // 실제 DOM이 변경되었을때 VM도 갱신해주는 부분
        events: {
          input(e: InputEvent, vm: ViewModel) {
            const target = e.target as HTMLInputElement;
            vm.parent.text.properties.value = target.value;
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

  constructor(
    private el: HTMLElement,
    private vm: ViewModel,
  ) {
    const visitor = new DomVisitor();
    const scanner = new VueScanner(visitor);
    this.binder = scanner.scan(this.el);

    const setBaseProcessor = (binder: Binder) => {
      baseProcessor.forEach((process) => binder.addProcessor(process));
      return binder;
    };

    setBaseProcessor(this.binder);
    this.binder.watch(this.vm);
  }
}

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
          click(e: Event, vm: ViewModel) {},
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

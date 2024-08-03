import { DomScanner, DomVisitor, Binder, ViewModel, Processor } from "./core/index";
import { WritableKeys } from "./types/index";

const visitor = new DomVisitor();
const scanner = new DomScanner(visitor);

export default class Vuelite {
  private binder: Binder;

  constructor(
    private el: HTMLElement,
    private vm: ViewModel,
  ) {
    this.binder = scanner.scan(this.el);

    const setProcessor = (binder: Binder) => {
      baseProcessor.forEach((process) => binder.addProcessor(process));
      return binder;
    };

    const baseProcessor = [
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
          (el[("on" + key) as WritableKeys<HTMLElement>] as any) = (e: Event) =>
            value.call(el, e, vm);
        }
      })("events"),
      new (class extends Processor {
        _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
          const { name, data } = vm.template;
          const template = DomScanner.get(name);
          if (!Array.isArray(data)) throw "invalid data";
          Object.freeze(this);

          visitor.visit((el) => {
            if (el.binder) {
              const [binder, vm] = el.binder;
              binder.unwatch(vm);
              delete el.binder;
            }
          }, el);

          // vm에 template, el 속성 추가하기 (타입)
          el.innerHTML = "";
          data.forEach((vm, i) => {
            if (!(vm instanceof ViewModel)) throw "invalid viewmodel";
            const child = template.cloneNode(true) as HTMLElement;
            const binder = setProcessor(scanner.scan(child));
            el.binders = [binder, vm];
            binder.watch(vm);
            el.appendChild(child);
          });
        }
      })("template"),
    ];

    setProcessor(this.binder);
    this.binder.watch(this.vm);

    const frame = () => {
      this.vm.changeContents();
      if (!this.vm.isStop) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

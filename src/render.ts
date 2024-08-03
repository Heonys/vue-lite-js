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

    // 기본 프로세서를 탑재
    const setBaseProcessor = (binder: Binder) => {
      baseProcessor.forEach((process) => binder.addProcessor(process));
      return binder;
    };

    // 프로세서란 ->
    // 프로세서를 만들때 전달한 [카테고리]를 키로 갖는 process 함수를 전달하고
    // addProcessor를 통해서 바인더에서 processors라는 컬렉션에 등록됨
    // 이후에 notify가 되어 updated된 알림이 왔을때 바인더에서
    // processor를 순회하면서 알림으로 온 카데고리를 업데이트 -> 즉, 그타이밍에 _process 함수 실행되어 업데이트

    // 쉽게말해 해당 vm안에 styles라는 속성이 존재하면 styles 프로세서의 process가 실행되는 것

    // TODO: baseprocessor 분리하기?
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

          // 기존에 그려진게 있는지 확인하고 지우는 절차
          // visitor.visit((el) => {
          //   if (el.binder) {
          //     const [binder, vm] = el.binder;
          //     binder.unwatch(vm);
          //     delete el.binder;
          //   }
          // }, el);
          el.innerHTML = "";
          data.forEach((vm, i) => {
            if (!(vm instanceof ViewModel)) throw "invalid viewmodel";
            const clone = template.cloneNode(true) as HTMLElement;
            const binder = setBaseProcessor(scanner.scan(clone));
            el.binder = [binder, vm];
            binder.watch(vm);
            el.appendChild(clone);
          });
        }
      })("template"),
    ];

    setBaseProcessor(this.binder);
    this.binder.watch(this.vm);

    const frame = () => {
      this.vm.changeContents();
      if (!this.vm.isStop) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

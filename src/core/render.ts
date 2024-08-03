import { WritableKeys } from "../types/index";
import { Binder } from "./binder";
import { Processor } from "./processor";
import { DomScanner } from "./scanner";
import { ViewModel } from "./viewmodel";
import { DomVisitor } from "./visitor";

const visitor = new DomVisitor();
const scanner = new DomScanner(visitor);

export default class Vuelite {
  private binder: Binder;

  constructor(
    private el: HTMLElement,
    private vm: ViewModel,
  ) {
    this.binder = scanner.scan(this.el);

    this.binder
      .addProcessor(
        new (class extends Processor {
          _process(vm: ViewModel, el: HTMLElement, key: any, value: any): void {
            el.style[key] = value;
          }
        })("styles"),
      )
      .addProcessor(
        new (class extends Processor {
          _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
            el.setAttribute(key, value);
          }
        })("attribute"),
      )
      .addProcessor(
        new (class extends Processor {
          _process(
            vm: ViewModel,
            el: HTMLElement,
            key: WritableKeys<HTMLElement>,
            value: any,
          ): void {
            (el[key] as any) = value;
          }
        })("properties"),
      )
      .addProcessor(
        new (class extends Processor {
          _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
            (el[("on" + key) as WritableKeys<HTMLElement>] as any) = (e: Event) =>
              value.call(el, e, vm);
          }
        })("events"),
      )
      .addProcessor(
        new (class extends Processor {
          _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
            const { name, data } = vm.template;
            const template = DomScanner.get(name);
          }
        })("template"),
      );

    this.binder.watch(this.vm);

    const frame = () => {
      this.vm.changeContents();
      if (!this.vm.isStop) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }
}

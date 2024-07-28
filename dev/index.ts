import { Scanner } from "../src/core/scanner";
import ViewModel from "../src/core/viewmodel";
import { Processor } from "../src/core/processor";

const viewmodel = ViewModel.get({
  wrapper: ViewModel.get({
    styles: {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
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

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector("#target")!);

binder
  .addProcessor(
    new (class extends Processor {
      _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
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
      _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
        el[key] = value;
      }
    })("properties"),
  )
  .addProcessor(
    new (class extends Processor {
      _process(vm: ViewModel, el: HTMLElement, key: string, value: any): void {
        el["on" + key] = (e: Event) => value.call(el, e, vm);
      }
    })("events"),
  );
binder.render(viewmodel);

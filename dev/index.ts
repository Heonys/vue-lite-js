import { DomScanner, ViewModel, Processor, DomVisitor } from "../src/core";

const viewmodel = ViewModel.get({
  isStop: false,
  changeContents() {
    this.contents.properties.innerHTML = Math.random().toString(16).replace(".", "");
  },
  wrapper: ViewModel.get({
    styles: {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
    events: {
      click(e: Event, vm: ViewModel) {
        vm.parent.isStop = true;
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
});

const scanner = new DomScanner(new DomVisitor());
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

binder.watch(viewmodel);

const f = () => {
  viewmodel.changeContents();
  if (!viewmodel.isStop) requestAnimationFrame(f);
};
requestAnimationFrame(f);

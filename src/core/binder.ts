import type { Processor } from "./processor";
import { ViewModel, Listener, ViewModelInfo } from "./viewmodel";

type Processors = { [K: string]: Processor };

export class Binder extends Listener {
  private items = new Set<ViewItem>();
  private processors: Processors = {};

  get binderItems() {
    return this.items;
  }

  add(item: ViewItem) {
    this.items.add(item);
  }

  addProcessor(v: Processor) {
    this.processors[v.category] = v;
  }

  // 초기상태 설정
  render(viewmodel: ViewModel) {
    const processorEnties = Object.entries(this.processors);

    this.items.forEach((item) => {
      const vm = viewmodel[item.el.uid];
      if (!(vm instanceof ViewModel)) return;
      const el = item.el;
      vm.uid = el.uid;

      processorEnties.forEach(([category, processor]) => {
        if (vm[category]) {
          Object.entries(vm[category]).forEach(([k, v]) => processor.process(vm, el, k, v));
        }
      });
    });
  }

  watch(vm: ViewModel) {
    vm.addListener(this);
    this.render(vm);
  }
  unwatch(vm: ViewModel) {
    vm.removeListener(this);
  }

  viewmodelUpdated(viewmodel: ViewModel, updated: Set<ViewModelInfo>) {
    const items: { [K: string]: [ViewModel, HTMLElement] } = {};

    this.items.forEach((item) => {
      items[item.property.directiveValue] = [viewmodel[item.property.directiveValue], item.el];
    });

    updated.forEach((info) => {
      if (!items[info.subkey]) return;
      const [vm, el] = items[info.subkey];
      const processor = this.processors[info.category.split(".").pop()];
      if (!el || !processor) return;
      processor.process(vm, el, info.key, info.value);
    });
  }
}

// ViewModel로 바꿔야하나
export class ViewItem {
  public children: ViewItem[] = [];
  public parent: ViewItem | null = null;

  constructor(
    public el: HTMLElement,
    public type: "root" | "static" | "reactive",
    public property?: {
      directive: string;
      modifier: string;
      directiveValue: string;
      template?: string;
    },
  ) {
    Object.seal(this);
  }
}

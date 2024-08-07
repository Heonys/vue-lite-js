import type { Processor } from "./processor";
import { ViewModel, ViewModelListener, ViewModelInfo } from "./viewmodel";

type Processors = { [K: string]: Processor };

export class Binder extends ViewModelListener {
  private items = new Set<BinderItem>();
  private processors: Processors = {};

  add(item: BinderItem) {
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
      items[item.viewmodelKey] = [viewmodel[item.viewmodelKey], item.el];
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

export class BinderItem {
  constructor(
    public el: HTMLElement,
    public directive: string,
    public modifier: string,
    public viewmodelKey: string,
  ) {
    Object.freeze(this);
  }
}

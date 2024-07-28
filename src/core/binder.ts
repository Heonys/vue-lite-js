import type { Processor } from "./processor";
import { ViewModel, ViewModelListener, ViewModelInfo } from "./viewmodel";

type Processors = { [K: string]: Processor };

export class Binder extends ViewModelListener {
  private items = new Set<BinderItem>();
  private processors: Processors = {};
  root: ViewModel;

  add(item: BinderItem) {
    this.items.add(item);
  }

  addProcessor(v: Processor) {
    this.processors[v.category] = v;
    return this;
  }

  render(viewmodel: ViewModel) {
    const processorEnties = Object.entries(this.processors);
    this.items.forEach((item) => {
      const vm = viewmodel[item.viewmodelKey];
      if (!(vm instanceof ViewModel)) return;
      const el = item.el;

      processorEnties.forEach(([category, processor]) => {
        Object.entries(vm[category]).forEach(([k, v]) => processor.process(vm, el, k, v));
      });
    });
  }

  watch(vm: ViewModel) {
    vm.addListener(this);
    this.render(vm);
    this.root = vm;
  }
  unwatch(vm: ViewModel) {
    vm.removeListener(this);
    this.root = null;
  }

  viewmodelUpdated(updated: Set<ViewModelInfo>) {
    const items: { [K: string]: [ViewModel, HTMLElement] } = {};
    this.items.forEach((item) => {
      items[item.viewmodelKey] = [this.root[item.viewmodelKey], item.el];
    });

    updated.forEach((info) => {
      if (!items[info.subkey]) return;
      const [vm, el] = items[info.subkey];
      const processor = this.processors[info.category];
      if (!el || !processor) return;
      processor.process(vm, el, info.key, info.value);
    });
  }
}

export class BinderItem {
  constructor(
    public el: HTMLElement,
    public viewmodelKey: string,
  ) {
    this.el = el;
    this.viewmodelKey = viewmodelKey;
    Object.freeze(this);
  }
}

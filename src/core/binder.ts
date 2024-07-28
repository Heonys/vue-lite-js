import type { Processor } from "./processor";
import ViewModel from "./viewmodel";

type Processors = {
  [K: string]: Processor;
};

export class Binder {
  private items = new Set<BinderItem>();
  private processors: Processors = {};

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
}

export class BinderItem {
  constructor(
    public el: HTMLElement,
    public viewmodelKey: string, // lazy binding
  ) {
    this.el = el;
    this.viewmodelKey = viewmodelKey;
    Object.freeze(this);
  }
}

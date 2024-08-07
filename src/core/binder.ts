import type { Processor } from "./processor";
import { ViewModel, ViewModelListener, ViewModelInfo } from "./viewmodel";

type Processors = { [K: string]: Processor };

export class Binder extends ViewModelListener {
  private items = new Set<BinderItem>();
  private processors: Processors = {};

  get binderItems() {
    return this.items;
  }

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

      /* 
      사실 프로세서를 통한 처리는 전부 v-model에 대한 처리를 하고있음 
      
      템플릿 문법과 v-text는 innterHTML으로 삽입해주고
      v-style의 경우는 사실 여기서 처리할 문제는 아니고
      optionParser에 의해서 추가되어야할 문제
      
      따라서 디렉티브의 modifer를 사용하는 bind, model, on의 경우는 특별하게 처리되어야함
      
      아닌가? 이또한 parser에서 바꿔줘야하나?

      v-on:click="handleClick" 이라는 디렉티브를 사용했을때

      [uid]: {
        events:{
          click: this.handleClick // 이런식으로 변환되어야함 
        }
      }

       
      */

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
      items[item.directiveValue] = [viewmodel[item.directiveValue], item.el];
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
    public directiveValue: string,
  ) {
    Object.freeze(this);
  }
}

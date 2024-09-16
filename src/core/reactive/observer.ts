import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { evaluateValue } from "@/utils/evaluate";
import { isObject, isPrimitive } from "@/utils/format";
import { isWatchMethod, WatchObject } from "../viewmodel/option";
import { Store } from "./store";

//  데이터의 변화를 추적하고 이를 절히 처리하는 역할
export class Observer {
  private value: any;
  private deps = new Set<Dep>();
  isMethods = false;

  constructor(
    private vm: Vuelite,
    private exp: string,
    private onUpdate: (newVal: any, oldVal?: any) => void,
    watchOption?: Omit<WatchObject, "handler">,
  ) {
    Store.addObserver(this);
    this.value = this.getterTrigger();

    if (watchOption) {
      const immediate = watchOption.immediate ?? false;
      immediate && onUpdate(this.value);
    } else {
      onUpdate(this.value);
    }
  }

  addDep(dep: Dep) {
    dep.subscribe(this);
    this.deps.add(dep);
  }

  // this.length-> 의도적으로 "length" 속성에 대한 get trap 발동하기 위함
  getterTrigger() {
    Dep.activated = this;
    const value = evaluateValue(this.vm, this.exp);
    if (isObject(value)) value._length;
    Dep.activated = null;
    return value;
  }

  update() {
    const oldValue = this.value;
    const newValue = this.getterTrigger();
    if (isPrimitive(newValue) && oldValue === newValue) return;
    this.value = newValue;
    this.isMethods
      ? this.onUpdate(newValue, oldValue)
      : this.vm.updateQueue.push(() => this.onUpdate(newValue, oldValue));
  }
}

export function createWatchers(vm: Vuelite) {
  const { watch } = vm.options;
  if (!watch) return;

  Object.entries(watch).forEach(([key, value]) => {
    if (isWatchMethod(value)) {
      new Observer(vm, key, value, { immediate: false });
    } else {
      const { handler, ...options } = value;
      new Observer(vm, key, handler, options);
    }
  });
}

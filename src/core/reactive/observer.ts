import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { evaluateValue } from "@/utils/evaluate";
import { isObject, isPrimitive } from "@/utils/format";

//  데이터의 변화를 추적하고 이를 적절히 처리하는 역할
export class Observer {
  private value: any;
  private deps = new Set<Dep>();

  constructor(
    private vm: Vuelite,
    private exp: string,
    public name: string,
    public node: Node,
    private onUpdate: (value: any, clone?: Node) => void,
  ) {
    this.value = this.getterTrigger();
    onUpdate(this.value);
  }

  addDep(dep: Dep) {
    dep.subscribe(this);
    this.deps.add(dep);
  }

  // this.length-> 의도적으로 "length" 속성에 대한 get trap 발동하기 위함
  getterTrigger() {
    Dep.activated = this;
    const value = evaluateValue(this.name, this.vm, this.exp);
    if (isObject(value)) value._length;
    Dep.activated = null;
    return value;
  }

  update() {
    const oldValue = this.value;
    const newValue = this.getterTrigger();
    if (isPrimitive(newValue) && oldValue === newValue) return;
    this.value = newValue;
    this.vm.updateQueue.push(() => this.onUpdate(newValue));
    // this.vm.updateQueue.push({ value: newValue, updater: this.onUpdate, target: this.node });
  }
}

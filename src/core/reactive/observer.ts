import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { evaluateValue } from "@/utils/evaluate";
import { isPrimitive } from "@/utils/format";

//  데이터의 변화를 추적하고 이를 적절히 처리하는 역할
export class Observer {
  private value: any;
  private deps = new Set<Dep>();

  constructor(
    private vm: Vuelite,
    private exp: string,
    public directiveName: string,
    private onUpdate: (value: any) => void,
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
    const value = evaluateValue(this.directiveName, this.vm, this.exp);
    if (Array.isArray(value)) value.length;
    Dep.activated = null;
    return value;
  }

  update() {
    const oldValue = this.value;
    const newValue = this.getterTrigger();
    if (isPrimitive(newValue) && oldValue === newValue) return;
    this.value = newValue;
    this.onUpdate.call(this.vm, newValue);
  }
}

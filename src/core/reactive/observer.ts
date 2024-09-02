import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { templateEvaluate, safeEvaluate } from "@/utils/evaluate";

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

  getterTrigger() {
    Dep.activated = this;
    const value =
      this.directiveName === "text"
        ? templateEvaluate(this.vm, this.exp)
        : safeEvaluate(this.vm, this.exp);
    Dep.activated = null;
    return value;
  }

  update() {
    const oldValue = this.value;
    const newValue = this.getterTrigger();

    if (oldValue !== newValue) {
      this.value = newValue;
      this.onUpdate.call(this.vm, newValue);
    }
  }
}

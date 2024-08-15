import { DirectiveMethod } from "./directive";
import { Vuelite } from "../index";
import { extractPath } from "../utils/index";

// 데이터의 변화를 감지하고, 구독자(Observer)에게 알리는 역할
export class Dep {
  static activated: Observer = null;
  private listener = new Set<Observer>();

  subscribe(observer: Observer) {
    this.listener.add(observer);
  }
  unsubscribe(observer: Observer) {
    this.listener.delete(observer);
  }
  notify() {
    this.listener.forEach((observer) => {
      observer.update();
    });
  }

  depend() {
    Dep.activated?.addDep(this);
  }
}

//  데이터의 변화를 추적하고 이를 적절히 처리하는 역할
export class Observer {
  private value: any;
  private deps = new Set<Dep>();
  /* 
  Observer 입장에서 Dep은 자신이 감시(의존)하고 있는 속성을 뜻함
  따라서 여러 속성들에 의존할 수 있기 때문에 Dep 컬렉션을 갖고있는 것 
  */

  constructor(
    private el: Node,
    private vm: Vuelite,
    private exp: string,
    private onUpdate: DirectiveMethod,
  ) {
    this.value = this.getterTrigger();
  }

  addDep(dep: Dep) {
    dep.subscribe(this);
    this.deps.add(dep);
  }

  getterTrigger() {
    /* 
    value를 가져오는 이유는 사실, 값 자체는 사용하지 않아서 의미없지만 
    vm의 데이터에서 get트랩을 발생시키기 위한 의도로 사용한다
    즉, Dep와 Observer와의 관계를 이어주기 위한 트리거로 사용됨 
    */

    Dep.activated = this;
    const value = extractPath(this.vm, this.exp);
    Dep.activated = null;
    return value;
  }

  update() {
    const value = this.value;
    const newValue = this.getterTrigger();

    console.log(value, newValue);

    if (value !== newValue) {
      this.value = newValue;
      this.onUpdate.call(this.vm, this.el, this.vm, this.exp);
    }
  }
}

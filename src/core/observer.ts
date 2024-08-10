import { Vuelite } from "../render";
import { extractValue } from "../utils/index";

// 데이터의 변화를 감지하고, 구독자(Observer)에게 알리는 역할
export class Dep {
  // 💡target을 스택으로 관리해야하는가?
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
class Observer {
  private value: any;
  private deps = new Set<Dep>();
  /* 
  Observer 입장에서 Dep은 자신이 감시(의존)하고 있는 속성을 뜻함
  따라서 여러 속성들에 의존할 수 있기 때문에 Dep 컬렉션을 갖고있는 것 
  */

  constructor(
    private vm: Vuelite,
    private exp: string,
    private onUpdate: (value: any, newValue: any) => void,
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
    const value = extractValue(this.vm, this.exp);
    Dep.activated = null;
    return value;
  }

  update() {
    // 값이 변경되었는지 이전값과 비교하고 값이 변경된 경우에만 View를 업데이트
    const value = this.value;
    const newValue = this.getterTrigger();

    if (value !== newValue) {
      this.value = newValue;
      this.onUpdate.call(this.vm, value, newValue);
    }
  }
}

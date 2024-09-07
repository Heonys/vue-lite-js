import { Observer } from "./observer";

// 데이터의 변화를 감지하고, 구독자(Observer)에게 알리는 역할
export class Dep {
  static activated: Observer = null;
  private listener = new Set<Observer>();

  constructor(public key: string) {}

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

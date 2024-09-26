import { Observer } from "./observer";

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
      if (!observer.isMethods) observer.update();
    });
  }
  depend() {
    Dep.activated?.addDep(this);
  }
}

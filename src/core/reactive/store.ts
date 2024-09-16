import { Dep } from "./dep";
import { Observer } from "./observer";

export class Store {
  private static globalDeps: Map<string, Dep>[] = [];
  private static globalObservers: Observer[] = [];

  static getStore() {
    return this.globalDeps;
  }
  static addStore(deps: Map<string, Dep>) {
    this.globalDeps.push(deps);
  }
  static forceUpdate() {
    this.globalDeps.forEach((deps) => {
      for (const dep of deps.values()) {
        dep.notify();
      }
    });
  }
  static addObserver(observer: Observer) {
    this.globalObservers.push(observer);
  }
  static updateMethods() {
    this.globalObservers.forEach((obs) => {
      if (obs.isMethods) obs.update();
    });
  }
}

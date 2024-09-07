import { Dep } from "./dep";

export class Store {
  private static globalDeps: Map<string, Dep>[] = [];

  static getStore() {
    return this.globalDeps;
  }
  static addStore(deps: Map<string, Dep>) {
    this.globalDeps.push(deps);
  }
  static notifyAll() {
    this.globalDeps.forEach((deps) => {
      for (const dep of deps.values()) dep.notify();
    });
  }
}

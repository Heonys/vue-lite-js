// class Observer {
//   constructor(data: object) {}
// }

// export function observer(data: object) {
//   return new Observer(data);
// }

class Reactivity {
  private updated = new Set<Info>();

  addInfo(diff: Info) {
    this.updated.add(diff);
  }

  constructor(public data: object) {
    Object.entries(data).forEach(([key, value]) => {
      this.define(key, value);
    });
  }

  define(key: string, value: any) {
    const child = reactivity(value);

    Object.defineProperty(this.data, key, {
      enumerable: true,
      configurable: false,
      get: () => value,
      set: (newValue) => {
        value = newValue;
        this.addInfo(new Info(key, value));
      },
    });
  }
}

function reactivity(data: any) {
  if (!data || typeof data !== "object") return;
  return new Reactivity(data);
}

class Info {
  constructor(
    public key: string,
    public value: any,
  ) {
    Object.freeze(this);
  }
}

/* 
⭐Dep의 역할 
1. 구독자 관리
2. 의존성 변경
3. 변경 알림 
*/
class Dep {
  // 여기서 구독자란 -> 리스너가 되겠지?
  listeners: [];

  watch() {}
  unwatch() {}
  notify() {}
}

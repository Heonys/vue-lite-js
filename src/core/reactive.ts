import { Vuelite } from "../render";
import { isObject } from "../utils/index";
import { Options } from "./option";

/* 
data, method, computed 이름 충돌 해결

data, method의 반응성을 주입 
computed 반응성이 주입된 속성에 의존하여 계산된 값을 제공하기 떄문에 마지막에 주입 
또한 추가적으로 data, method의 변화가 computed를 갱신함 

*/

type Target = { [k: string]: any };

class Reactivity {
  public proxy: Target;

  constructor(data: object) {
    this.proxy = this.define(data);
  }

  define(data: object) {
    const me = this;
    const caches = new Map<string, Target>();

    const handler = {
      get(target: Target, key: string, receiver: Target) {
        if (Object.hasOwn(target, key)) {
          const child = target[key];
          if (isObject(child)) {
            if (!caches.has(key)) caches.set(key, me.define(child));
            return caches.get(key);
          }
        }
        return Reflect.get(target, key, receiver);
      },
      set(target: Target, key: string, value: any, receiver: Target) {
        if (isObject(value)) caches.set(key, me.define(value));
        else caches.delete(key);

        return Reflect.set(target, key, value, receiver);
      },
    };

    return new Proxy(data, handler);
  }
}

export function injectReactive(options: Options, vm: Vuelite) {
  const { data, methods } = options;
  const returned = typeof data === "function" ? data() : {};
  const proxy = new Reactivity(returned).proxy;

  for (const key in returned) {
    if (methods && Object.hasOwn(methods, key)) throw `${key} has already been declared`;

    Object.defineProperty(vm, key, {
      enumerable: true,
      configurable: false,
      get: () => proxy[key],
      set: (value) => {
        proxy[key] = value;
      },
    });
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

import { isObject, typeOf } from "@utils/format";
import { Dep, Store } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { isAccessor } from "../viewmodel/option";

type Target = { [k: string]: any };

export class Reactivity {
  public proxy: Target;
  constructor(data: object) {
    this.proxy = this.define(data);
  }

  define(data: object) {
    const me = this;
    const caches = new Map<string, Target>();
    const deps = new Map<string, Dep>();
    Store.addStore(deps);

    const handler = {
      get(target: Target, key: string, receiver: Target) {
        if (typeOf(key) === "symbol") return Reflect.get(target, key, receiver);
        if (!deps.has(key)) deps.set(key, new Dep(key));
        deps.get(key).depend();

        const child = target[key];
        if (isObject(child)) {
          if (!caches.has(key)) caches.set(key, me.define(child));
          return caches.get(key);
        }
        return Reflect.get(target, key, receiver);
      },
      set(target: Target, key: string, value: any, receiver: Target) {
        const result = Reflect.set(target, key, value, receiver);

        if (deps.has(key)) {
          deps.get(key).notify();
        } else {
          /* 
            기존에 반응성이 주입된 객체에 동적으로 속성을 추가하면 해당속성은
            get트랩을 거치지 않았기 때문에 Dep <-> Observer의 관계를 갖지않는다 
            따라서 비효율적이지만, 등록된 Dep 전체를 업데이트 한다 
            예외적으로 배열은 length 속성의 변화가 배열을 update를 해주기 때문에 강제로 업데이트하지 않는다. 
          */
          if (Array.isArray(target)) return result;
          Store.forceUpdate();
        }
        return result;
      },
    };

    return new Proxy(data, handler);
  }
}

export function injectReactive(vm: Vuelite) {
  const { data } = vm.options;
  const returned = typeof data === "function" ? data() : {};
  const proxy = new Reactivity(returned).proxy;

  for (const key in returned) {
    Object.defineProperty(vm, key, {
      configurable: false,
      get: () => proxy[key],
      set: (value) => {
        proxy[key] = value;
      },
    });
  }

  injectMethod(vm);
  injectComputed(vm);
}

function injectMethod(vm: Vuelite) {
  const { methods } = vm.options;
  if (!methods) return;

  Object.entries(methods).forEach(([key, method]) => {
    if (Object.hasOwn(vm, key)) throw new Error(`${key} has already been declared`);
    Object.defineProperty(vm, key, {
      value: (...args: any[]) => method.apply(vm, args),
    });
  });
}

function injectComputed(vm: Vuelite) {
  const { computed } = vm.options;
  if (!computed) return;

  for (const key in computed) {
    if (Object.hasOwn(vm, key)) throw new Error(`${key} has already been declared`);
  }

  Object.entries(computed).forEach(([key, value]) => {
    const descripter: PropertyDescriptor = {};
    if (isAccessor(value)) {
      descripter.get = value.get.bind(vm);
      descripter.set = (...params) => {
        value.set.apply(vm, params);
      };
    } else {
      descripter.get = () => (value as Function).call(vm);
    }
    Object.defineProperty(vm, key, descripter);
  });
}

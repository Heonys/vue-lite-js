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
        const oldLength = target._length;
        const result = Reflect.set(target, key, value, receiver);
        const newLength = target._length;
        /*
          동적으로 속성이 추가되면 해당 속성은 get 트랩을 통과하지 않으므로, 
          Dep이 생성되지 않을뿐더러, Observer가 연결되지 않습니다. 
          이로 인해, 속성이 추가되었지만 업데이트를 담당할 옵저버가 없어서 
          forceUpdate을 통해 화면 전체를 업데이트하는 성능 문제가 있었습니다. 

          그래서 객체에 _length 라는 커스텀 속성을 추가하여 배열처럼 객체에서도 길이를 추적할 수 있게하고 
          get트랩에서 _length 키에대한 dep을 만들어 두어, 이후에 동적으로 속성을 추가될떄
          해당 객체가 반응형 데이터인 경우에만 get트랩에 의해서 deps에 "_length"키가 존재할테니까
          이로써 동적으로 속성을 추가하더라도 해당 객체가 반응형 데이터인 경우에만 업데이트되도록 보장되며, 
          그외의 모든 데이터는 화면을 업데이트 하지않도록 개선하였습니다. 
        */

        // console.log(value);

        if (oldLength !== newLength && deps.has("_length")) {
          deps.get("_length").notify();
        }
        if (deps.has(key)) {
          deps.get(key).notify();
        }
        return result;
      },
      deleteProperty(target: Target, property: string) {
        const oldLength = target._length;
        const result = Reflect.deleteProperty(target, property);
        const newLength = target._length;

        if (oldLength !== newLength && deps.has("_length")) {
          deps.get("_length").notify();
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

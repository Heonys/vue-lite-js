const isObject = (data) => data !== null && typeof data === "object";

class Reactivity {
  constructor(data) {
    this.proxy = this.define(data);
  }

  define(data) {
    const me = this;
    const caches = new Map();

    const handler = {
      get(target, key, receiver) {
        console.log("get ::", key);
        if (Object.hasOwn(target, key)) {
          const child = target[key];
          if (isObject(child)) {
            if (!caches.has(key)) caches.set(key, me.define(child));
            return caches.get(key);
          }
        }

        return Reflect.get(target, key, receiver);
      },
      set(target, key, value, receiver) {
        if (isObject(value)) caches.set(key, me.define(value));
        else caches.delete(key);
        return Reflect.set(target, key, value, receiver);
      },
    };

    return new Proxy(data, handler);
  }
}

const obj = {
  name: "jiheon2",
  type: {
    category: {
      name: "hello",
      type: "js",
    },
    childrne: [1, 2, 3],
  },
};

function extractValue(obj, path) {
  path = path.trim();
  if (Object.hasOwn(obj, path)) return obj[path];

  return path.split(".").reduce((target, key) => {
    if (target && Object.hasOwn(target, key)) return target[key];
    return null;
  }, obj);
}

const proxy = new Reactivity(obj).proxy;

proxy.type.category.name;

// const value = extractValue(proxy, "type.category.name");

const isObject = (data) => data !== null && typeof data === "object";

const caches = new Map();
function obsever(data) {
  const handler = {
    get(target, key, receiver) {
      if (Object.hasOwn(target, key)) {
        const child = target[key];
        if (isObject(child)) {
          if (!caches.has(key)) caches.set(key, obsever(child));
          return caches.get(key);
        }
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      // console.log(key, value);

      if (isObject(value)) caches.set(key, obsever(value));
      else caches.delete(key);

      return Reflect.set(target, key, value, receiver);
    },
  };

  return new Proxy(data, handler);
}

const obj = {
  name: "jiheon",
  recur: {
    name: {
      recur: "jiheon2",
    },
  },
};

const observed = obsever(obj);
observed.recur.name.recur2 = "hello2";

console.log(caches);

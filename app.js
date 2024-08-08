function obsever(data) {
  const handler = {
    get(target, key, receiver) {
      if (Object.hasOwn(target, key)) {
        //
      }
      return Reflect.get(target, key, receiver);
    },
    set(target, key, value, receiver) {
      return Reflect.set(target, key, value, receiver);
    },
  };

  return new Proxy(data, handler);
}

const obj = {
  name: "jiheon",
  recur: {
    name: "hello",
  },
};

const observed = obsever(obj);

observed.recur.name = "world";

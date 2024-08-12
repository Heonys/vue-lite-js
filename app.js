function assignPath(obj, path, value) {
  path = path.trim();

  let target = obj;
  path.split(".").forEach((key, index, arr) => {
    if (index === arr.length - 1) {
      target[key] = value;
    } else {
      if (!Object.hasOwn(target, key)) return;
      target = target[key];
    }
  });
}

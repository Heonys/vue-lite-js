export function typeOf(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export const getValue = (target: Record<PropertyKey, any>, path: string): any => {
  if (path in target) {
    const v: any = target[path];
    return v;
  }
  let val: any = target;
  path.split(".").forEach((k) => {
    val = val[k];
  });
  return val;
};

export const setValue = (target: Record<PropertyKey, any>, path: string, value: any): any => {
  if (path in target) {
    target[path] = value;
    return;
  }
  let val: any = target;
  path.split(".").forEach((k, i, arr) => {
    if (i < arr.length - 1) {
      val = val[k];
    } else {
      val[k] = value;
    }
  });
  return val;
};

export const isElementNode = (node: Element): Boolean => node.nodeType === 1;
export const isTextNode = (node: Element): Boolean => node.nodeType === 3;

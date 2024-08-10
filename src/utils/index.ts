export const isObject = (data: any) => data !== null && typeof data === "object";

export const isElementNode = (node: Node): node is HTMLElement => {
  return node.nodeType === 1;
};

export const isTextNode = (node: Node) => {
  return node.nodeType === 3;
};

export function extractValue(obj: Record<PropertyKey, any>, path: string) {
  path = path.trim();
  if (Object.hasOwn(obj, path)) return obj[path];

  return path.split(".").reduce((target, key) => {
    if (target && Object.hasOwn(target, key)) return target[key];
    return null;
  }, obj);
}

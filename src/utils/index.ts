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

/* 
현재 노드가 template 바인딩을 하려고할떄 
만약 부모 요소에 v-text 속성이 존재한다면 이미 바인딩한 v-text가 우선시 되기위함 
*/
export const isIncludeText = (node: HTMLElement) => {
  const attrs = node?.attributes;
  if (!attrs) return;
  return Array.from(attrs).some((v) => v.name === "v-text");
};

export function normalizeToJson(str: string) {
  return str
    .replace(/(\w+):/g, '"$1":') //
    .replace(/:\s*([^,\s{}]+)/g, (match, p1) => {
      if (/^'.*'$/.test(p1) || /^".*"$/.test(p1)) return match;
      return `: "${p1}"`;
    });
}

export function isJsonFormat(str: string) {
  return true;
}

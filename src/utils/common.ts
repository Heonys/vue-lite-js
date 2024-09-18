export function extractPath(obj: Record<PropertyKey, any>, path: string) {
  path = path.trim();
  return path.split(".").reduce((target, key) => {
    if (target && Object.hasOwn(target, key)) return target[key];
    return null;
  }, obj);
}

function isValidInteger(str: string) {
  return /^\d+$/.test(str);
}

export function assignPath(obj: Record<PropertyKey, any>, path: string, value: any) {
  path = path.trim();
  let target = obj;
  const splited = path.split(/[.[\]]/).filter(Boolean);

  splited.forEach((key, index, arr) => {
    if (index === arr.length - 1) {
      target[key] = value;
    } else if (isValidInteger(key)) {
      if (!Array.isArray(target)) return;
      target = target[+key];
    } else {
      if (!Object.hasOwn(target, key)) return;
      target = target[key];
    }
  });
}

export function normalizeToJson(str: string) {
  return str
    .replace(/(\w+):/g, '"$1":') //
    .replace(/:\s*([^,\s{}]+)/g, (match, p1) => {
      if (/^".*"$/.test(p1)) return match;
      return `: "${p1}"`;
    });
}

export function boolean2String(str: string) {
  if (str === "true") return true;
  if (str === "false") return false;
  return str;
}

export function createDOMTemplate(template: string) {
  if (!template) return;
  const div = document.createElement("div");
  div.innerHTML = template;
  return div.firstElementChild as HTMLElement;
}

export const isNonObserver = (name: string, modifier: string) => {
  return name.startsWith("else") || (name === "bind" && modifier === "key");
};

export function isDeferred(key: string) {
  return key === "if" || key === "for";
}

export function node2Fragment(el: Element) {
  const fragment = document.createDocumentFragment();
  let child: Node;
  while ((child = el.firstChild)) fragment.appendChild(child);
  return fragment;
}

export function isReserved(str: string) {
  return str.charCodeAt(0) === 0x24;
}

export function initializeProps(props: string[]) {
  return props.reduce(
    (acc, cur) => {
      acc[cur] = undefined;
      return acc;
    },
    {} as Record<string, any>,
  );
}

export function typeOf(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

export const isElementNode = (node: Element): Boolean => node.nodeType === 1;
export const isTextNode = (node: Element): Boolean => node.nodeType === 3;

export function extractReg(ptn: RegExp, text: string) {
  const match = ptn.exec(text);
  return match ? match[1] : null;
}

export function isEmptyObject(obj: object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

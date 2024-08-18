// 삼항 연산자 확인
export function isTernary(str: string) {
  const ptn = /(.*?)\s*\?\s*(.*?)\s*:\s*(.*)/;
  const match = str.match(ptn);
  return (
    match && {
      condition: match[1],
      truthy: match[2],
      falsy: match[3],
    }
  );
}

export function isObjectFormat(str: string) {
  const regex = /^\{(\s*[a-zA-Z_$][a-zA-Z_$0-9]*\s*:\s*[^{}]+\s*,?\s*)+\}$/;
  return regex.test(str);
}

function typeOf(value: any): string {
  return Object.prototype.toString //
    .call(value)
    .slice(8, -1)
    .toLowerCase();
}

export const isObject = (data: any): data is object => {
  return typeOf(data) === "object";
};

export const isInlineStyle = (value: any): value is string => {
  return typeOf(value) === "string" && value.indexOf("_") === 0;
};

export function isHtmlFormat(str: string) {
  const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
  return htmlTagPattern.test(str);
}

export const isElementNode = (node: Node): node is HTMLElement => {
  return node.nodeType === 1;
};

export const isTextNode = (node: Node) => {
  return node.nodeType === 3;
};

/* 
현재 노드가 template 바인딩을 하려고할떄 
만약 부모 요소에 v-text 속성이 존재한다면 이미 바인딩한 v-text가 우선시 되기위함 
*/
export const isIncludeText = (node: HTMLElement) => {
  const attrs = node?.attributes;
  if (!attrs) return;
  return Array.from(attrs).some((v) => v.name === "v-text");
};

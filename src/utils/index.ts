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

/* 
인라인 스타일에서 따옴표를 사용한 즉, 반응형 데이터가 아닌 실제 css 프로퍼티 값을 사용한 경우 
구분할 수 있게 #을 붙여서 JSON으로 변환 
*/
export function normalizeToJson(str: string) {
  return str
    .replace(/(\w+):/g, '"$1":') //
    .replace(/:\s*'([^']+)'/g, ': "_$1"') //
    .replace(/:\s*([^,\s{}]+)/g, (match, p1) => {
      if (/^".*"$/.test(p1)) return match;
      return `: "${p1}"`;
    });
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

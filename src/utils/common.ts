export function extractPath(obj: Record<PropertyKey, any>, path: string) {
  path = path.trim();
  return path.split(".").reduce((target, key) => {
    if (target && Object.hasOwn(target, key)) return target[key];
    return null;
  }, obj);
}

export function assignPath(obj: Record<PropertyKey, any>, path: string, value: any) {
  path = path.trim();
  let target = obj;
  path.split(".").forEach((key, index, arr) => {
    if (index === arr.length - 1) target[key] = value;
    else {
      if (!Object.hasOwn(target, key)) return;
      target = target[key];
    }
  });
}

/* 
인라인 스타일에서 따옴표를 사용한 즉, 반응형 데이터가 아닌 실제 css 프로퍼티 값을 사용한 경우 
구분할 수 있게 #을 붙여서 JSON으로 변환 
*/
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
  return div.firstElementChild;
}

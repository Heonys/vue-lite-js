import { Vuelite } from "../core/viewmodel/vuelite";
import { isFunctionFormat, isObjectFormat, isQuotedString } from "./format";

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

export function evaluateBoolean(str: string) {
  return str === "true" ? true : str === "false" ? false : str;
}

/* 
디렉티브에 전달받은 표현식이 인라인 포맷인지 아니면 일반 리액티브가 주입된 데이터인지를 구분해서 계산하는 함수 
일반 데이터라면 vm에서 데이터를 추출하고 template에서 사용하는 함수형태라면 메소드를 실행해서 반환
또한 인라인 포맷이라면 객체로 변환하고 순회하면서 다시 재귀적으로 vm에서 데이터를 추출하고 
최종적으로 계산된 결과값을 반환해주는 함수 
*/
export function evaluateValue(vm: Vuelite, exp: string) {
  let result;
  if (isObjectFormat(exp)) {
    const json: Record<string, any> = JSON.parse(normalizeToJson(exp));
    result = Object.entries(json).reduce((acc, [key, value]) => {
      if (isQuotedString(value)) {
        acc[key] = evaluateBoolean(value.slice(1, -1));
      } else {
        acc[key] = extractPath(vm, value);
      }
      return acc;
    }, json);
  } else {
    const match = isFunctionFormat(exp);
    result = match ? (extractPath(vm, match) as Function).call(vm) : extractPath(vm, exp);
  }

  return result;
}

export function createDOMTemplate(template: string) {
  if (!template) return;
  const div = document.createElement("div");
  div.innerHTML = template;
  return div.firstElementChild;
}

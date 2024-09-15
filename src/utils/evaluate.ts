import Vuelite from "@/core/viewmodel/vuelite";
import { hasTemplate, isFunctionFormat, isObjectFormat, isQuotedString } from "./format";
import { boolean2String, extractPath, normalizeToJson } from "./common";
import { extractTemplate } from "./directive";

/*
safeEvaluate 함수는 viewmodel에서 exp라는 속성에 접근해서 값을 가져오는 동작을 하며
exp가 일반 문자열이라면 vm에서 데이터를 추촐하고 함수형태라면 실행해서 반환하며 
스타일 바인딩이나 클래스 바인딩에서 디렉티브에 값을 할달할때 인라인 포맷을 지원하기 때문에 
이러한 객체 형태의 인라인 포맷이라면 재귀적으로 순회하며 해당 계산된 객체를 반환하여
최종적으로 계산된 결과값을 반환해주는 함수 
*/
export function safeEvaluate(vm: Vuelite, exp: string) {
  let result;
  if (isObjectFormat(exp)) {
    const json: Record<string, any> = JSON.parse(normalizeToJson(exp));
    result = Object.entries(json).reduce((acc, [key, value]) => {
      if (isQuotedString(value)) {
        acc[key] = boolean2String(value.slice(1, -1));
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

/* 
unsafeEvaluate 함수는 new Function을 통해서 동적으로 코드를 생성하기 때문에 보안 취약점이 존재하는 함수입니다
template 에서 삼항연산자, 산술연산, 문자열 템플릿 리터럴, 배열의 인덱스 접근 등의 표현식을 평가할때 사용됩니다
*/
export function unsafeEvaluate(context: object, expression: string) {
  try {
    const fn = new Function(`
      with (this) {
        return ${expression};
      }
    `);
    return fn.call(context);
  } catch (error) {
    return undefined;
  }
}

/* 
템플릿 문법에서 각각 {{ key }} 포맷의 key 값을 뽑아내서 그 표현식에 해당하는 값을 vm에서 가져오고 
원래 표현식의 key 값으로 대체하여 결과적으로 템플릿 문법을 계산된 값으로 대체하는 함수 
*/
export function evaluateTemplate(vm: Vuelite, exp: string) {
  const templates = extractTemplate(exp);
  const evaluatedValues = templates.reduce(
    (acc, template) => {
      acc[template] = unsafeEvaluate(vm, template);
      return acc;
    },
    {} as Record<string, any>,
  );

  const result = exp.replace(/{{\s*(.*?)\s*}}/g, (_, key) => {
    return evaluatedValues[key] || "";
  });
  return result;
}

export function evaluateValue(vm: Vuelite, exp: string) {
  if (hasTemplate(exp)) {
    return evaluateTemplate(vm, exp);
  } else {
    return unsafeEvaluate(vm, exp);
  }
}

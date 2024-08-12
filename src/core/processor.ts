import { Vuelite } from "../render";
import {
  isObjectFormat,
  normalizeToJson,
  isObject,
  extractValue,
  isInlineStyle,
  isHtmlFormat,
} from "../utils/index";
import { DirectiveKey } from "./directive";

export interface Processor {
  (node: Node, vm: Vuelite, exp: string, modifier?: string): void;
}

export const processors: { [Method in DirectiveKey]: Processor } = {
  text(node, vm, exp) {
    const proxy = extractValue(vm, exp);
    node.textContent = proxy;
  },
  bind(el: HTMLElement, vm, exp, modifier) {
    if (modifier === "text" || modifier === "class" || modifier === "style") {
      this[modifier](el, vm, exp);
    } else {
      if (el.hasAttribute(modifier)) {
        el.setAttribute(modifier, extractValue(vm, exp));
      }
    }
  },

  /* 
    양방향 바인딩 

    input, textarea, select 지원
    input 요소의 값이나 상태를 통일된 방식으로 접근할 수 있게 해주는 헬퍼 함수 추가해서 일관되게 가져오기 
    결국 v-model은 그러면 식별자를 입력하지 않아도됨 현재 element에 상태에 따라서 자동 바인딩
  */
  model(el: HTMLElement, vm, exp, modifier?: string) {
    // 만약에 식별자를 넘기면 해당 속성을 검사하고 양방향 바인딩

    switch (el.tagName) {
      case "INPUT": {
        // 타입확인후 해당 타입마다 종류별로 바인딩

        /* 
        type=radio의 경우는 checked 값도 존재하지만 checked 바인딩이 아닌 value 바인딩 해야하며, 
        같은 v-model값을 사용하는 애들끼리 같은 라디오 그룹을 유지해야함 
        즉, vm의 상태값이 해당 radio 그룹내의 value값이 같은 라디오 버튼이 체크 되야함 
        */
        break;
      }
      case "TEXTAREA": {
        // value에 바인딩
        break;
      }
      case "SELECT": {
        // -> 옵션들 중에서 선택된 값에 바인딩 (다중선택 고려)
        break;
      }
      default: {
        throw new Error(`Unsupported element type: ${el.tagName}`);
      }
    }
  },

  class(el: HTMLElement, vm, exp) {
    if (isObjectFormat(exp)) {
      const json: object = JSON.parse(normalizeToJson(exp));

      Object.entries(json).forEach(([key, value]) => {
        if (value === "true") el.classList.add(key);
        else {
          const proxy = extractValue(vm, value);
          if (proxy === true) el.classList.add(key);
        }
      });
    } else {
      const proxy = extractValue(vm, exp);
      if (isObject(proxy)) {
        Object.entries(proxy).forEach(([key, value]) => {
          if (value) el.classList.add(key);
        });
      }
    }
  },

  style(el: HTMLElement, vm, exp) {
    if (isObjectFormat(exp)) {
      const json = JSON.parse(normalizeToJson(exp));

      for (const [key, value] of Object.entries(json)) {
        if (isInlineStyle(value)) {
          (el.style as any)[key] = value.slice(1);
        } else {
          const styleValue = extractValue(vm, value as string);
          (el.style as any)[key] = styleValue;
        }
      }
    } else {
      const styles = extractValue(vm, exp);
      if (isObject(styles)) {
        for (const [key, value] of Object.entries(styles)) {
          (el.style as any)[key] = value;
        }
      }
    }
  },

  html(el: HTMLElement, vm, exp) {
    if (isHtmlFormat(exp)) el.innerHTML = exp;
    else {
      const proxy = extractValue(vm, exp);
      if (typeof proxy === "string") el.innerHTML = proxy;
    }
  },

  eventHandler(el: HTMLElement, vm, exp, modifier) {
    const fn = extractValue(vm, exp);
    if (typeof fn === "function") el.addEventListener(modifier, fn);
  },
};

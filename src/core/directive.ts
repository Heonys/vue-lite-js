import { Vuelite } from "../index";
import {
  isObjectFormat,
  normalizeToJson,
  isObject,
  extractPath,
  assignPath,
  isInlineStyle,
  isHtmlFormat,
} from "../utils/index";
import { DirectiveKey } from "./binder";

/* 
    결국 어떤 디렉티브던 초기에 render 함수를 한번 실행하고 (mount 단계)
    watcher를 생성해서 그 render함수를 넘겨주면 특정 속성이 변화했을때 dep가 update를 시켜줌을 통해
    결과적으로 render가 다시 실행되고 해당 값이 최신값으로 갱신됨  
*/

/* 
하나의 디렉티브당 하나의 옵저버 생성
하나의 속성 (리액티브가 부여된)당 하나의 Dep 생성 
단, 이벤트 핸들러는 반응형 데이터와 무관하기때문에 v-on으로 watcher가 생성되진 않음 
*/

export interface DirectiveMethod {
  (node: Node, vm: Vuelite, exp: string, modifier?: string): void;
}

export const directives: { [Method in DirectiveKey]: DirectiveMethod } = {
  text(node, vm, exp) {
    const proxy = extractPath(vm, exp);
    node.textContent = proxy;
  },
  bind(el: HTMLElement, vm, exp, modifier) {
    if (modifier === "text" || modifier === "class" || modifier === "style") {
      this[modifier](el, vm, exp);
    } else {
      if (el.hasAttribute(modifier)) {
        el.setAttribute(modifier, extractPath(vm, exp));
      }
    }
  },

  /* 
    양방향 바인딩 
    input, textarea, select 지원
    input 요소의 값이나 상태를 통일된 방식으로 접근할 수 있게해서 일관되게 바인딩하기 

    date, month, time, week 등 날짜나 시간관련된 속성 및 레거시 속성들을 제외  
    file의 경우는 논외로 v-model이 아닌 change 이벤트를 통해 수동으로 파일관리를 해야함 
    지원되는 타입 (text, number, url, tel, search, ragnge, radio, password, email, color, checkbox)
  */

  model(el: HTMLElement, vm, exp) {
    switch (el.tagName) {
      case "INPUT": {
        const input = el as HTMLInputElement;

        if (input.type === "checkbox") {
          input.checked = extractPath(vm, exp);
          input.addEventListener("change", (event) => {
            const value = (event.target as HTMLInputElement).checked;
            assignPath(vm, exp, value);
          });
        } else if (input.type === "radio") {
          input.name = exp;
          input.checked = extractPath(vm, exp) === input.value;
          input.addEventListener("change", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(vm, exp, value);
          });
        } else {
          input.value = extractPath(vm, exp);
          input.addEventListener("input", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(vm, exp, value);
          });
        }
        break;
      }
      case "TEXTAREA": {
        const textarea = el as HTMLTextAreaElement;
        textarea.value = extractPath(vm, exp);
        textarea.addEventListener("input", (event) => {
          const value = (event.target as HTMLTextAreaElement).value;
          assignPath(vm, exp, value);
        });
        break;
      }
      case "SELECT": {
        const select = el as HTMLSelectElement;

        if (select.multiple) {
          const options = Array.from(select.options);
          const proxy = extractPath(vm, exp);
          if (!Array.isArray(proxy)) return;

          options.forEach((option) => {
            option.selected = proxy.includes(option.value);
          });

          select.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            const selectedValues = Array.from(target.selectedOptions).map((option) => option.value);
            assignPath(vm, exp, selectedValues);
          });
        } else {
          select.value = extractPath(vm, exp);
          select.addEventListener("change", (event) => {
            const value = (event.target as HTMLSelectElement).value;
            assignPath(vm, exp, value);
          });
        }
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
          const proxy = extractPath(vm, value);
          if (proxy === true) el.classList.add(key);
        }
      });
    } else {
      const proxy = extractPath(vm, exp);
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
          const styleValue = extractPath(vm, value as string);
          (el.style as any)[key] = styleValue;
        }
      }
    } else {
      const styles = extractPath(vm, exp);
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
      const proxy = extractPath(vm, exp);
      if (typeof proxy === "string") el.innerHTML = proxy;
    }
  },

  eventHandler(el: HTMLElement, vm, exp, modifier) {
    const fn = extractPath(vm, exp);
    if (typeof fn === "function") el.addEventListener(modifier, fn);
  },
};

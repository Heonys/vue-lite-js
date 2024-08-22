import { Observer, Vuelite } from "./index";
import { normalizeToJson, extractPath, assignPath, evaluateValue } from "../utils/common";
import {
  isFunctionFormat,
  isHtmlFormat,
  isObject,
  isObjectFormat,
  isQuotedString,
} from "../utils/format";
import type { DirectiveTypes } from "../types/directive";
import { updaters } from "./updaters";
import { extractDirective, isEventDirective } from "../utils/directive";

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

export class Directive {
  modifier: string;
  updater: Function;

  constructor(
    name: string,
    private vm: Vuelite,
    private node: Node,
    private exp: any,
  ) {
    const { key, modifier } = extractDirective(name);
    this.modifier = modifier;

    if (isEventDirective(name)) this.eventHandler();
    else this[key]();

    if (node instanceof HTMLElement) node.removeAttribute(name);
  }

  // 이거 중복되는거 손보기
  // bind할때 v-bind 직접 사용하는 케이스 테스트 해야함
  text() {
    this.bind(updaters.text);
  }
  style() {
    this.bind(updaters.style);
  }
  class() {
    this.bind(updaters.class);
  }
  html() {
    this.bind(updaters.html);
  }
  model() {
    const el = this.node as HTMLElement;
    switch (el.tagName) {
      case "INPUT": {
        const input = el as HTMLInputElement;
        if (input.type === "checkbox") {
          input.addEventListener("change", (event) => {
            const value = (event.target as HTMLInputElement).checked;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputCheckbox);
        } else if (input.type === "radio") {
          input.name = this.exp;
          input.addEventListener("change", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputRadio);
        } else {
          input.addEventListener("input", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputNormal);
        }
        break;
      }
      case "TEXTAREA": {
        el.addEventListener("input", (event) => {
          const value = (event.target as HTMLTextAreaElement).value;
          assignPath(this.vm, this.exp, value);
        });
        this.bind(updaters.textarea);
        break;
      }
      case "SELECT": {
        // multiple 옵션 고려 x
        el.addEventListener("change", (event) => {
          const value = (event.target as HTMLSelectElement).value;
          assignPath(this.vm, this.exp, value);
        });
        this.bind(updaters.select);
        break;
      }
      default: {
        throw new Error(`Unsupported element type: ${el.tagName}`);
      }
    }
  }
  bind(updater?: (node: Node, value: any) => void) {
    const mod = this.modifier;
    if (mod === "text" || mod === "class" || mod === "style") {
      updater = updaters[mod];
    }

    let evaluated;
    if (isObjectFormat(this.exp)) {
      const json: Record<string, any> = JSON.parse(normalizeToJson(this.exp));
      evaluated = Object.entries(json).reduce((acc, [key, value]) => {
        if (isQuotedString(value)) {
          acc[key] = evaluateValue(value.slice(1, -1));
        } else {
          acc[key] = extractPath(this.vm, value);
        }
        return acc;
      }, json);
    } else {
      const match = isFunctionFormat(this.exp);
      evaluated = match
        ? (extractPath(this.vm, match) as Function).call(this.vm)
        : extractPath(this.vm, this.exp);
    }

    updater && updater(this.node, evaluated);
    new Observer(this.node, this.vm, this.exp, (node, value) => {
      updater && updater(node, value);
    });
  }
  eventHandler() {
    const fn = extractPath(this.vm, this.exp);
    if (typeof fn === "function") this.node.addEventListener(this.modifier, fn);
  }
}

/* 





*/

export const directives: DirectiveTypes = {
  text(node, vm, exp) {
    const match = isFunctionFormat(exp);

    if (match) {
      node.textContent = (extractPath(vm, match) as Function).call(vm);
      new Observer(node, vm, match, (node, value: any) => (node.textContent = value));
    } else {
      node.textContent = extractPath(vm, exp);
      new Observer(node, vm, exp, (node, value: any) => (node.textContent = value));
    }

    // node.textContent = value;
    // new Observer(node, vm, exp, (value: any) => (node.textContent = value));
  },
  bind(el: HTMLElement, vm, exp, modifier) {
    if (modifier === "text" || modifier === "class" || modifier === "style") {
      this[modifier](el, vm, exp, null);
    } else {
      const updater = (value: any, modifier: string) => ((el as any)[modifier] = value);
      updater(extractPath(vm, exp), modifier);
      new Observer(el, vm, exp, (node, value: any) => updater(value, modifier));
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
          new Observer(el, vm, exp, (node, value: any) => (input.checked = value));
        } else if (input.type === "radio") {
          input.name = exp;
          input.checked = extractPath(vm, exp) === input.value;
          input.addEventListener("change", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(vm, exp, value);
          });
          new Observer(el, vm, exp, (node, value: any) => (input.checked = value === input.value));
        } else {
          input.value = extractPath(vm, exp);
          input.addEventListener("input", (event) => {
            const value = (event.target as HTMLInputElement).value;
            assignPath(vm, exp, value);
          });
          new Observer(el, vm, exp, (node, value: any) => (input.value = value));
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
        new Observer(el, vm, exp, (node, value: any) => (textarea.value = value));
        break;
      }
      case "SELECT": {
        const select = el as HTMLSelectElement;

        if (select.multiple) {
          const updater = (value: any) => {
            const options = Array.from(select.options);
            if (!Array.isArray(value)) return;

            options.forEach((option) => {
              option.selected = value.includes(option.value);
            });
          };
          updater(extractPath(vm, exp));
          select.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            const selectedValues = Array.from(target.selectedOptions).map((option) => option.value);
            assignPath(vm, exp, selectedValues);
          });

          new Observer(el, vm, exp, (node, value: any) => updater(value));
        } else {
          select.value = extractPath(vm, exp);
          select.addEventListener("change", (event) => {
            const value = (event.target as HTMLSelectElement).value;
            assignPath(vm, exp, value);
          });
          new Observer(el, vm, exp, (node, value: any) => (select.value = value));
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
      // console.log(json);

      Object.entries(json).forEach(([key, value]) => {
        console.log(key, value);

        if (value === "true") el.classList.add(key);
        else {
          const proxy = extractPath(vm, value);
          if (proxy === true) el.classList.add(key);
        }
      });
    } else {
      const proxy = extractPath(vm, exp);
      const updater = (value: any) => {
        if (isObject(value)) {
          Object.entries(value).forEach(([k, v]) => {
            if (v) el.classList.add(k);
          });
        }
      };
      updater(proxy);
      new Observer(el, vm, exp, (node, value: any) => updater(value));
    }
  },

  style(el: HTMLElement, vm, exp) {
    if (isObjectFormat(exp)) {
      const json: Record<string, any> = JSON.parse(normalizeToJson(exp));
      // console.log(json);

      for (const [key, value] of Object.entries(json)) {
        if (isQuotedString(value)) {
          (el.style as any)[key] = value.slice(1, -1);
        } else {
          (el.style as any)[key] = extractPath(vm, value as string);
        }
      }
      // 이경우는 왜 옵저버 안만듬
    } else {
      const styles = extractPath(vm, exp);
      const updater = (value: any) => {
        if (isObject(value)) {
          for (const [k, v] of Object.entries(value)) {
            (el.style as any)[k] = v;
          }
        }
      };
      updater(styles);
      new Observer(el, vm, exp, (node, value: any) => updater(value));
    }
  },

  html(el: HTMLElement, vm, exp) {
    if (isHtmlFormat(exp)) el.innerHTML = exp;
    else {
      const proxy = extractPath(vm, exp);
      if (typeof proxy === "string") el.innerHTML = proxy;
      new Observer(el, vm, exp, (node, value: any) => (el.innerHTML = value));
    }
  },

  eventHandler(el: HTMLElement, vm, exp, modifier) {
    const fn = extractPath(vm, exp);
    if (typeof fn === "function") el.addEventListener(modifier, fn);
  },
};

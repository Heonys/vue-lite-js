import { Observer, Vuelite } from "./index";
import { Updater, updaters } from "./updaters";
import { extractPath, assignPath, evaluateValue } from "../utils/common";
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
  constructor(
    name: string,
    private vm: Vuelite,
    private node: Node,
    public exp: any,
  ) {
    const { key, modifier } = extractDirective(name);
    this.modifier = modifier;

    if (isEventDirective(name)) this.eventHandler();
    else this[key]();

    if (node instanceof HTMLElement) node.removeAttribute(name);
  }

  bind(updater?: Updater) {
    const mod = this.modifier;
    if (mod === "text" || mod === "class" || mod === "style") {
      updater = updaters[mod];
    }

    const value = evaluateValue(this.vm, this.exp);
    updater && updater(this.node, value);
    new Observer(this.node, this.vm, this.exp, (node, value) => {
      updater && updater(node, value);
    });
  }
  /* 
    양방향 바인딩 
    input, textarea, select 지원
    input 요소의 값이나 상태를 통일된 방식으로 접근할 수 있게해서 일관되게 바인딩하기 

    date, month, time, week 등 날짜나 시간관련된 속성 및 레거시 속성들을 제외  
    file의 경우는 논외로 v-model이 아닌 change 이벤트를 통해 수동으로 파일관리를 해야함 
    지원되는 타입 (text, number, url, tel, search, ragnge, radio, password, email, color, checkbox)
  */
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
          this.bind(updaters.inputValue);
        }
        break;
      }
      case "TEXTAREA": {
        el.addEventListener("input", (event) => {
          const value = (event.target as HTMLTextAreaElement).value;
          assignPath(this.vm, this.exp, value);
        });
        this.bind(updaters.inputValue);
        break;
      }
      case "SELECT": {
        const select = el as HTMLSelectElement;
        if (select.multiple) {
          select.addEventListener("change", (event) => {
            const target = event.target as HTMLSelectElement;
            const selectedValues = Array.from(target.selectedOptions).map((option) => option.value);
            assignPath(this.vm, this.exp, selectedValues);
          });
          this.bind(updaters.inputMultiple);
        } else {
          select.addEventListener("change", (event) => {
            const value = (event.target as HTMLSelectElement).value;
            assignPath(this.vm, this.exp, value);
          });
          this.bind(updaters.inputValue);
        }
        break;
      }
      default: {
        throw new Error(`Unsupported element type: ${el.tagName}`);
      }
    }
  }

  text() {
    this.bind(updaters.text.bind(this));
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

  eventHandler() {
    const fn = extractPath(this.vm, this.exp);
    if (typeof fn === "function") this.node.addEventListener(this.modifier, fn);
  }
}

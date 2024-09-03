import { Updater, updaters } from "./updaters";
import { extractPath, assignPath } from "@utils/common";
import { extractDirective, isEventDirective, isValidDirective } from "@utils/directive";
import Vuelite from "../viewmodel/vuelite";
import { Observer } from "../reactive/observer";
import { Condition } from "./condition";

/* 
  하나의 디렉티브당 하나의 옵저버를 생성하고 updater 함수를 옵저버에 등록하며
  모든 반응형 데이터들은 변화를 감지하면 Dep에 의해서 변화를 알리기 때문에
  이후에 notify를 통해 모든 구독자들의 update를 실행시킨다 

  하지만 초기 렌더링인 마운트 단계에서 한번은 update가 되어야 하기때문에 updater를 초기에 한번은 수동으로 호출하고 
  이후에 Observer의 updater에 의해서 반응형값의 변화가 실제 DOM에 반영됨 
*/
export class Directive {
  directiveName: string;
  modifier: string;
  constructor(
    name: string,
    public vm: Vuelite,
    public node: Node,
    public exp: any,
  ) {
    const { key, modifier } = extractDirective(name);
    this.directiveName = key;
    this.modifier = modifier;

    if (!isValidDirective(key)) return;
    if (key === "if") {
      vm.deferredTasks.push(() => new Condition(vm, node as HTMLElement, key, exp));
    } else {
      if (isEventDirective(name)) this.eventHandler();
      else this[key]();
      if (node instanceof HTMLElement) node.removeAttribute(name);
    }
  }

  bind(updater?: Updater) {
    const mod = this.modifier;
    if (mod === "text" || mod === "class" || mod === "style") {
      updater = updaters[mod].bind(this);
    }

    if (!updater) {
      updater = mod ? updaters.customBind.bind(this) : updaters.objectBind.bind(this);
    }
    new Observer(this.vm, this.exp, this.directiveName, (value) => {
      updater && updater(this.node, value);
    });
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
  if() {}
  else() {}
  show() {
    this.bind(updaters.show);
  }
  eventHandler() {
    const fn = extractPath(this.vm, this.exp);
    if (typeof fn === "function") this.node.addEventListener(this.modifier, fn);
  }
}

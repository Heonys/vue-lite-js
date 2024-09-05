import { extractAlias, extractKeywords, typeOf } from "@/utils/format";
import Vuelite from "../viewmodel/vuelite";
import { unsafeEvaluate } from "@/utils/evaluate";
import { assignContext } from "@/utils/context";

/* 
일단 v-else 처럼 v-bind:key 의 경우 디렉티브 생성을 하지 않도록 해야할듯
그리고 ForLopp에서 key의 여부를 확인하는게 합리적일 것 같다

근데 중요한건 자식을 스킵하는데
문제는 자식을 ForLoop에서 돌면서 새로운 element를 만들어서 삽입해야하는데
이때, 자식에 디렉티브가 존재하면 이 시점에 새로운 Directive를 생성해줘야하는 파싱단계가 추가됨
*/

export type LoopContext = Record<string, any>;

export class ForLoop {
  hasKey: boolean;
  loopContexts: LoopContext[] = [];
  parent: HTMLElement;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {
    this.parent = el.parentElement || vm.el;
    this.hasKey = el.hasAttribute(":key") || el.hasAttribute("v-bind:key");
    const keywords = extractKeywords(this.exp);
    if (!keywords) return;

    const { alias, list } = keywords;
    const isWrapped = extractAlias(alias);
    const data = unsafeEvaluate(vm, list);

    this.processByType(data, alias, isWrapped);
    this.renderForLoop(this.el);

    /* 
    일단은 안쪽에 디렉티브가 없는것부터 해결하자
    item in items 이렇게 들어오면 

    1. 우선 items에 해당 하는 컬렉션을 vm에서 가져옴 
    2. 배열인지 객체에인지에 따라서 (item, index) 또는 (value, key, index) 형태로 값을 가져옴
    3. key가 있다면 key를 뽑아냄 없으면 index로 적용해야함

    4. items만큼 순회하며 현재 엘리먼트를 동적으로 생성해야함 
    5. 표현식으로 들어온 {{ item.message }}을 계산해서 fragment에 순서대로 추가함
    6. 전부 순회하고 결국 el을 대체하여 nodechage인가? 암튼 원본 자리를 대신함
    7. updater 에선 원본 배열이 바뀌면 다시 실행되어야함 
    8. 초기값과 update 될때 잘 구분하기 


    -> key 적용 

    */
  }
  renderForLoop(el: HTMLElement) {
    const fragment = document.createDocumentFragment();
    const clone = el.cloneNode(true) as HTMLElement;
    clone.removeAttribute("v-for");

    this.loopContexts.forEach((context) => {
      const computedEl = assignContext(context, clone);
      fragment.appendChild(computedEl);
    });
    this.parent.replaceChild(fragment, el);
  }

  render() {
    // 옵저버 생성
  }

  updater(value: any) {}

  processByType(value: any, alias: string, isWrapped: string[]) {
    switch (typeOf(value)) {
      case "array": {
        const array = value as any[];
        array.forEach((v, i) => {
          const context: LoopContext = {};
          if (isWrapped) {
            isWrapped[0] && (context[isWrapped[0]] = v);
            isWrapped[1] && (context[isWrapped[1]] = i);
          } else {
            context[alias] = v;
          }
          this.loopContexts.push(context);
        });
        break;
      }
      /* 
        items의 종류에 따라 달라짐 
        배열 -> (item, index) 형태로 반환 
        객체 -> (value, key, index) 형태로 반환 
        숫자 -> 그 숫자만 큼 반복하며 인덱스 반한
        문자열 -> 문자열도 이터레이터 순환하며 배열과 같이 반환 
        그외의 경우는 렌더링 되지않음 
      */
      case "object": {
        const obj = value as object;
        break;
      }
      case "number": {
        break;
      }
      case "string": {
        break;
      }
      default: {
        break;
      }
    }
  }
}

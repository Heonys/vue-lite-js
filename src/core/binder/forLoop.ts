import { extractAlias, extractKeywords } from "@/utils/format";
import Vuelite from "../viewmodel/vuelite";
import { unsafeEvaluate } from "@/utils/evaluate";
import { assignContext, calculateLoopSize } from "./context";

/* 
일단 v-else 처럼 v-bind:key 의 경우 디렉티브 생성을 하지 않도록 해야할듯
그리고 ForLopp에서 key의 여부를 확인하는게 합리적일 것 같다

근데 중요한건 자식을 스킵하는데
문제는 자식을 ForLoop에서 돌면서 새로운 element를 만들어서 삽입해야하는데
이때, 자식에 디렉티브가 존재하면 이 시점에 새로운 Directive를 생성해줘야하는 파싱단계가 추가됨
*/

/*  
v-for은 현재 원래 dom에서 그자리에 컬렌션을 순회하면서 dom을 추가하는 역할을 하고 있기때문에
f-if와 마찬가지로 필연적으로 dom의 구조를 바꾸기 때문에 파싱할때 다른 디렉티브 처리에 영향을 줄 수 있다
따라서 조건부 렌더링과 마찬가지로 defferdTask에서 lazy하게 후처리하고 있으며 
둘다 디렉티브 생성을 미루고 있어서 v-if와 v-for중에 뭐를 먼저 렌더링하는게 영향을 줄 수 있을 것 같은데
따라서 v-if와 v-for를 중첩해서 사용하는 것은 정상적인 동작을 보장하지 못한다 (공식문서도 안티패턴이라고 설명)
*/

export class ForLoop {
  hasKey: boolean;
  alias: string[];
  parent: HTMLElement;
  data: any;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {
    this.parent = el.parentElement || vm.el;
    this.hasKey = el.hasAttribute(":key") || el.hasAttribute("v-bind:key");
    const keywords = extractKeywords(this.exp);
    if (!keywords) return;

    const { key, list } = keywords;
    this.data = unsafeEvaluate(vm, list);
    this.alias = extractAlias(key);

    this.renderForLoop(this.el, list);
  }

  /* 





*/

  renderForLoop(el: HTMLElement, listExp: string) {
    const fragment = document.createDocumentFragment();
    const clone = el.cloneNode(true) as HTMLElement;
    clone.removeAttribute("v-for");

    Array.from({ length: calculateLoopSize(this.data) }).forEach((_, index) => {
      const computedEl = assignContext(this, clone, listExp, index);
      fragment.appendChild(computedEl);
    });
    this.parent.replaceChild(fragment, el);
  }

  render() {
    // 옵저버 생성
  }

  updater(value: any) {}
}

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

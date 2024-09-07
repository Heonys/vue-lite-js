import { extractAlias, extractKeywords } from "@/utils/format";
import Vuelite from "../viewmodel/vuelite";
import { bindContext } from "./context";
import { loopSize } from "@/utils/context";
import { removeLoopDirective } from "@/utils/directive";
import { Observer } from "../reactive/observer";

/*  
v-for은 현재 원래 dom에서 그자리에 컬렌션을 순회하면서 dom을 추가하는 역할을 하고 있기때문에
f-if와 마찬가지로 필연적으로 dom의 구조를 바꾸기 때문에 파싱할때 다른 디렉티브 처리에 영향을 줄 수 있다
따라서 조건부 렌더링과 마찬가지로 defferdTask에서 lazy하게 후처리하고 있으며 
둘다 디렉티브 생성을 미루고 있어서 v-if와 v-for중에 뭐를 먼저 렌더링하는게 영향을 줄 수 있을 것 같은데
따라서 v-if와 v-for를 중첩해서 사용하는 것은 정상적인 동작을 보장하지 못한다 (공식문서도 안티패턴이라고 설명)
*/

export class ForLoop {
  alias: string[];
  parent: HTMLElement;
  listExp: string;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {
    this.parent = el.parentElement || vm.el;
    const keywords = extractKeywords(this.exp);
    if (!keywords) return;

    const { key, list } = keywords;
    this.listExp = list;
    this.alias = extractAlias(key);
    this.render();
  }

  render() {
    new Observer(this.vm, this.listExp, "for", (value) => {
      this.updater(value);
    });
  }

  updater(value: any) {
    const fragment = document.createDocumentFragment();

    Array.from({ length: loopSize(value) }).forEach((_, index) => {
      const clone = this.el.cloneNode(true) as HTMLElement;
      removeLoopDirective(clone);
      const boundEl = bindContext(this, clone, this.listExp, index, value);
      fragment.appendChild(boundEl);
    });
    this.parent.innerHTML = "";
    this.parent.appendChild(fragment);

    /* 
    this.parent.replaceChild(fragment, this.el);
    초기에 replaceChild 메소드를 사용해서 교체하력 했으나 
    replaceChild는 oldChild와 부모와의 관계를 완전히 끊어버리는 특징이 있었다
    그래서 this.el에 대한 참조는 유지한채 게속 복사하면서 동적으로 생성해야 하기때문에
    부모자식 관계가 끊어지는 replaceChild를 반복적으로 사용할 수 없었고,
    결과적으로 innerHTML으로 초기화하는 방식을 택했다
    */
  }
}

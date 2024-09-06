import { extractAlias, extractKeywords } from "@/utils/format";
import Vuelite from "../viewmodel/vuelite";
import { unsafeEvaluate } from "@/utils/evaluate";
import { bindContext } from "./context";
import { loopSize } from "@/utils/context";
import { removeLoopDirective } from "@/utils/directive";

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
  data: any;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {
    this.parent = el.parentElement || vm.el;
    const keywords = extractKeywords(this.exp);
    if (!keywords) return;

    const { key, list } = keywords;
    this.data = unsafeEvaluate(vm, list);
    this.alias = extractAlias(key);
    this.render(this.el, list);
  }

  render(el: HTMLElement, listExp: string) {
    const fragment = document.createDocumentFragment();

    Array.from({ length: loopSize(this.data) }).forEach((_, index) => {
      const clone = el.cloneNode(true) as HTMLElement;
      removeLoopDirective(clone);
      const boundEl = bindContext(this, clone, listExp, index);
      fragment.appendChild(boundEl);
    });
    this.parent.replaceChild(fragment, el);
  }
}

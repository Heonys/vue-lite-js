import { extractAlias, extractKeywords } from "@/utils/format";
import Vuelite from "../viewmodel/vuelite";
import { Context } from "./context";
import { loopSize } from "@/utils/context";
import { removeLoopDirective } from "@/utils/directive";
import { Observer } from "../reactive/observer";

/*  
  v-for은 현재 원래 dom에서 그자리에 컬렌션을 순회하면서 dom을 추가하는 역할을 하고 있기때문에
  f-if와 마찬가지로 필연적으로 dom의 구조를 바꾸기 때문에 파싱할때 다른 디렉티브 처리에 영향을 줄 수 있다
  따라서 조건부 렌더링과 마찬가지로 defferdTask에서 lazy하게 후처리하고 있으며 
  startIndex와 endIndex로 이전 렌더링에 그려진 요소들을 추적하고 그 위치에 새로운 요소들로 교체할 수 있게 설계
*/

export class ForLoop {
  alias: string[];
  parent: HTMLElement;
  listExp: string;
  startIndex: number;
  endIndex: number;
  loopEffects: Function[] = [];
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
    public parentContext: Record<string, any>,
  ) {
    this.parent = el.parentElement || vm.$el;
    this.startIndex = Array.from(this.parent.children).indexOf(el);
    const keywords = extractKeywords(this.exp);
    if (!keywords) return;

    const { key, list } = keywords;
    this.listExp = list;
    this.alias = extractAlias(key);
    this.render();
  }

  render() {
    new Observer(this.vm, this.listExp, (newVal, oldVal) => {
      this.updater(newVal);
    });
  }

  updater(value: any) {
    const fragment = document.createDocumentFragment();
    const length = loopSize(value);
    const endPoint = this.startIndex + length - 1;
    const context = new Context(this, value);

    Array.from({ length }).forEach((_, index) => {
      const clone = this.el.cloneNode(true) as HTMLElement;
      removeLoopDirective(clone);
      const boundEl = context.bind(clone, index);
      fragment.appendChild(boundEl);
    });

    if (this.el.isConnected) {
      // 첫 렌더링 -> 이때는 this.el과 this.parent의 관계가 유지되기 때문에 replaceChild로 바로 교체
      this.parent.replaceChild(fragment, this.el);
      this.endIndex = endPoint;
    } else {
      /* 
       이후에 updater되었을땐 일종의 템플릿 역할을 하는 this.el이 dom에서 제거되어 메모리상에만 남아서 fragment 만드는 요도로만 사용됨
       여기서 새로만든 fragment를 parent에 삽입해야하는데 이전에 렌더링했던 요소들의 위치에 정확히 들어가야하기 때문에
       start 인덱스부터 value의 길이만큼 계산해서 이전 index만큼 요소들을 삭제하고 fragment를 삽입
      */
      for (let i = this.endIndex; i >= this.startIndex; i--) {
        const child = this.parent.children[i];
        if (child) {
          this.parent.removeChild(child);
        }
      }

      this.el.remove(); // if/else랑 중첩해서 사용할때 초기에 렌더링되지않은 경우 템플릿이 남아있어서 제거
      const ref = this.parent.children[this.startIndex];
      this.parent.insertBefore(fragment, ref);
      this.endIndex = this.startIndex + length - 1;
    }
    this.clearEffects();
  }

  clearEffects() {
    this.loopEffects.forEach((fn) => fn());
    this.loopEffects = [];
  }
}

import Vuelite from "../viewmodel/vuelite";
import { Observer } from "../reactive/observer";

export class Condition {
  parent: HTMLElement;
  childIndex: number;
  isVisible: boolean;
  fragment: DocumentFragment;
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public name: string,
    public exp: any,
  ) {
    this.parent = el.parentElement || vm.el;
    this.childIndex = Array.from(this.parent.children).indexOf(el);
    this.fragment = document.createDocumentFragment();
    this.render();
  }

  render() {
    new Observer(this.vm, this.exp, this.name, (value) => {
      this.updater(value);
    });
  }

  /* 
    isVisible은 v-if 디렉티브가 적용된 요소가 현재 보여져야 하는지를 체크하는 구분자 이지만, 
    updater가 호출되었다는건 외부에서 반응형 데이터의 변화로 인해 visible의 상태가 반전되어야함을 의미하고 
    따라서 updater 메소드 내부에서의 isVisible은 이전 상태를 나타냄 
  */
  updater(value: any) {
    if (!this.isVisible) {
      if (value) {
        // 지금까지 안보였지만 -> 앞으로 보여야함
        this.isVisible = true;
        const ref = Array.from(this.parent.children)[this.childIndex];
        this.parent.insertBefore(this.fragment, ref);
      } else {
        // 초기의 상태값이 false일 경우
        this.fragment.appendChild(this.el);
      }
    } else {
      if (!value) {
        // 게속 보여지고 있었지만 -> 앞으로 사라져야함
        this.isVisible = false;
        this.fragment.appendChild(this.el);
      }
    }
  }
}

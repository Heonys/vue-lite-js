import { Vuelite } from "../render";
import { DirectiveKey } from "./directive";

export interface Processor {
  (node: Node, vm: Vuelite, exp: string, modifier?: string): void;
}

export const processors: { [Directive in DirectiveKey]: Processor } = {
  text: (node, vm, exp, modifier): void => {
    /* 
    텍스트 바인딩으로 템플릿 바인딩과 기본적으로 동일함 
    v-text="title", {{ title }}
    */
    node.textContent = exp;
  },
  bind: (node, vm, exp, modifier) => {
    /* 
      단방향 바인딩 
       */
  },
  model: (node, vm, exp, modifier) => {
    /* 
      양방향 바인딩 

      input, textarea, select 지원
      input 요소의 값이나 상태를 통일된 방식으로 접근할 수 있게 해주는 헬퍼 함수 추가해서 일관되게 가져오기 
      결국 v-model은 그러면 식별자를 입력하지 않아도됨 현재 element에 상태에 따라서 자동 바인딩
      */
  },

  class: (el: HTMLElement, vm, exp, modifier) => {
    /* 
      v-class="{ active: isActive }" 이런식으로 사용
      isActive의 boolean 값에 따라서 active 클래스의 존재 여부가 결정됨 

      하지만 이처럼 꼭 인라인일 필요는 없고 data에서 classData = { active: isActive } 가있고 
      v-class="classData" 으로 바인딩 할 수 있음

      🚩원래 Vue.js에서는 클래스 바인딩과 스타일바인딩을 위해 v-bind에 식별자를 넘겨주지만
      Vuelite에서는 편의를 위해 v-class, v-style 디렉티브를 추가
      근데 이것도 우선은 디렉티브 축약표현이 나오면 큰 메리트가 없어지긴함 
      :style, :class 이런식으로 사용할테니까 일단 보류 
      */
  },

  style: (el: HTMLElement, vm, exp, modifier) => {
    /* 
      v-class와 마찬가지로 인라인 스타일 바인딩과 데이터 바인딩 이렇게 2가지를 제공함 
      v-style={ color: activeColor } 
      v-style={styleData} // 여기서 말하는 styleData는 반응형 데이터 한정
      */
  },

  html: (el: HTMLElement, vm, exp, modifier) => {
    /* 
      v-html="template"
      innerHTML 속성으로 해당 html을 삽입 (text삽입 또는 HTMLelemnet 삽입가능)
      인라인으로도 사용가능하긴 한데 데이터 바인딩하는게 간결
      
      */
  },

  eventHandler: (el: HTMLElement, vm, exp, modifier) => {},
};

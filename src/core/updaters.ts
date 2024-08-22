/* 

하나의 디렉티브로 통일되는 인터페이스를 만들어야해 

안그러면 지금처럼 모든 디렉티브에서 직접 updater 만들고 new Obserber 이런식으로 만들고있음

따라서 하나의 obserber에서 통일시켜야함

bind는 이미 사용되고 있으므로 이를 처리하는 메소드를 따로 만들어보자 
generaterObserber 이런느낌으로 

updater들은 따로 관리 ? 

*/

import { isObject } from "../utils/format";

/* 
updater란 dep에서 변화를 감지하고 구독자들에게 변화를 알릴때 
전달되는 구체적인 업데이트 함수  
*/

export const updaters = {
  text(node: Node, value: string) {
    node.textContent = value;
  },
  class(el: HTMLElement, value: any) {
    /*
    
    여기서 들어오는 value는 트리거를 통해서 반환되는 반응형값인데 
    중요한건 v-class에서 반응형값을 직접 사용하는경우라면 문제가되지 않지만 
    
    실제 디렉티브에서 인라인 스타일로 class를 사용하고 있다면 문제가됨 
    
    

    
    */

    if (isObject(value)) {
      Object.entries(value).forEach(([k, v]) => {
        if (v) el.classList.add(k);
      });
    } else {
      //
    }
  },
  style(el: HTMLElement, value: object) {
    Object.entries(value).forEach(([k, v]) => {
      (el.style as any)[k] = v;
    });
  },
  html(el: HTMLElement, value: string) {
    el.innerHTML = value;
  },
};

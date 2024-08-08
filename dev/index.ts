import { Vuelite } from "../src/render";

new Vuelite({
  el: "#app",
  data: {
    title: "제목",
    contents: "내용없음",
  },
  computed: {},
  mothod: {
    increase() {},
    decrease() {},
  },
  styles: {
    wrapper: {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
    textStyle: {
      color: "#FF0000",
    },
  },
});

/* 


computed, method 차이 

1) computed
computed는 리액티브가 주입된 데이터에 의존하여 계산된 값을 반환한다
따라서 종속된 데이터가 변경되지 않는 한, 결과를 캐시하고 동일한 데이터에 대해 여러 번 접근해도 계산이 한 번만 수행된다
또한 종속된 데이터가 변경되면 자동으로 값을 갱신한다

2) method 
호출될 때마다 실행되며, 반응형 데이터에 의존하지 않기 때문에 캐싱되지 않는 일반적인 함수이다 
따라서 동일한 메서드를 여러 번 호출하면 매번 새로운 결과를 계산한다
computed는 주로 계산된 값을 제공하는 데 사용되고, methods는 어떤 동작이나 이벤트 처리기를 정의할 때 사용된다.

*/

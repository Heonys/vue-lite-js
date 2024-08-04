import { Vuelite } from "../src/render";

new Vuelite({
  el: "#target",
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
  },
});

/* 
data, method, computed는 그냥 뷰모델에 값을 할당하면 되지 않을까?

v-model은 양방향 바인딩 -> 따라서 양방향 바인딩 구조 만들 필요가 있음
v-template은 사실상 v-for에서 배열을 순회하는것과 유사
이벤트 디렉티브 추가,
디렉티브 축약표현 추가 
*/

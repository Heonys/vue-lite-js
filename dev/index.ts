import Vuelite from "../src/index";

const template = `
          <div>
            <input type="text" v-model="title">
            <div>{{ title }}</div>
            <p>{{ fullNameMethod() }}</p>
          </div>`;

const vm = new Vuelite({
  el: "#app",
  data() {
    return {
      title: "초기",
      hello: true,
      visible: true,
      visible2: false,
      inputValue: "",
      objectBind: {
        id: "testId",
        class: "testClass",
        customKey: "customValue",
      },
      isDisabled: true,
      count: 1,
      itemCount: "",
      outer: [
        { inner: ["Item 1.1", "Item 1.2", "Item 1.3"] },
        { inner: ["Item 2.1", "Item 2.2"] },
        { inner: ["Item 3.1", "Item 3.2", "Item 3.3", "Item 3.4"] },
      ],
      outerList: [
        { innerList: ["Item 1.1", "Item 1.2", "Item 1.3"] },
        { innerList: ["Item 2.1", "Item 2.2"] },
        { innerList: ["Item 3.1", "Item 3.2", "Item 3.3", "Item 3.4"] },
      ],
      items: [
        { id: 1, message: "Item 1" },
        { id: 2, message: "Item 2" },
        { id: 3, message: "Item 3" },
      ],
      children: [
        { id: 1, name: "children 1" },
        { id: 2, name: "children 2" },
      ],
      lang: [
        { id: 1, type: "python" },
        { id: 2, type: "c++" },
      ],
      myObject: {
        title: "Vue에서 목록을 작성하는 방법",
        author: "홍길동",
        publishedAt: "2016-04-10",
      },
      message: "",
      firstName: "Jiheon",
      lastName: "Kim",
      textStyle: {
        color: "#FF0000",
        fontSize: 30,
      },
      fontSize: 30,
      checked: true,
      hasError: false,
      isActive: true,
      classData: {
        isActive: true,
        myclass: false,
        myclass2: true,
      },
      world: "<div>hello world</div>",
      selectedValue: "male",
      selectedOption: "Vue",
    };
  },
  watch: {
    // title: {
    //   handler(newVar, oldVar) {
    //     console.log("fullName change", newVar, " :: ", oldVar);
    //   },
    //   immediate: true,
    // },
    // title(newVar, oldVar) {
    //   console.log("fullName change", newVar, " :: ", oldVar);
    // },
    // ["myObject.author"]: {
    //   handler(newVar, oldVar) {
    //     console.log("author change", newVar, " :: ", oldVar);
    //   },
    //   immediate: true,
    // },
  },
  beforeUpdate() {
    // this.count++;
    // console.log("beforeUpdate");
  },
  updated() {
    // console.log("updated");
  },

  beforeCreate() {
    // console.log("beforeCreate");
  },
  created() {
    // console.log("created");
  },
  mounted() {
    // console.log("mounted");
  },

  computed: {
    isChecked() {
      return this.checked ? "checked" : "unchecked";
    },
    isVisible() {
      return this.visible ? "truthy" : "falsy";
    },
    fullName() {
      // console.log("computed");
      return this.firstName + " + " + this.lastName;
    },
    fullName2: {
      get() {
        return this.firstName + " + " + this.lastName;
      },
      set(newValue) {
        [this.firstName, this.lastName] = newValue.split(" ");
      },
    },
    staticValue() {
      return Math.random().toFixed(3);
    },
  },

  methods: {
    handleInput(e) {
      this.title = e.target.value;
    },
    handleCheck() {
      this.checked = !this.checked;
    },
    async handleClick() {
      const url = "https://jsonplaceholder.typicode.com/todos/1";
      const respones = await fetch(url);
      const data = await respones.json();
      this.title = data.title;
    },
    handleClickButton() {
      console.log(this.$refs);
    },
    change() {
      this.$data.title = "";
    },
    fullNameMethod() {
      console.log("이름 계산중");

      return this.firstName + " + " + this.lastName;
    },
    fullNameMethod2() {
      console.log("3+2 계산중");

      return 3 + 2;
    },
    addItem(value: any) {
      /* 
      배열을 새로 할당하면 기존에 Reactity를 주입해놓은 기존의 배열이 
      새로 할당되면서 참조가 바뀌기 때문에 변경된 배열을 감지하지 못하는것 같다
      */
      // const arr = [
      //   { id: 1, message: "Item 1" },
      //   { id: 2, message: "Item 2" },
      //   { id: 3, message: "Item 3" },
      //   { id: 4, message: "Item 4" },
      //   { id: 5, message: "Item 5" },
      //   { id: 6, message: "Item 6" },
      // ];
      // this.items = arr;
      // console.log("index.ts", this.items);
      // this.items.splice(0, this.items.length);
      this.items.push({ id: 10, message: `Item 10` });

      this.myObject = {
        title: "Vue에서 목록을 작성하는 방법",
        author: "홍길동",
      };

      // this.myObject.title = "change Title";

      // this.myObject.newKey = "newValue";
      // this.title = "hello";
    },
    getRandom() {
      console.log("랜덤 생성중");
      return Math.random().toFixed(3);
    },
  },
  styles: {
    // only camelCase key
    "#wrapper": {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
  },
});

// console.log(vm);

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

/* 
  템플릿은 데이터의 결과를 보여주는게 아닌 데이터의 상태를 표현하기 위한 것
  computed는 데이터의 상태 표현을 최적화하고, methods는 동작을 수행하는 역할을 명확히 구분짓기 위해 설계된 것 
*/

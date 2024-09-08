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
      title: "",
      hello: true,
      visible: true,
      visible2: true,
      inputValue: "",
      objectBind: {
        id: "testId",
        class: "testClass",
        customKey: "customValue",
      },
      itemCount: "",
      items: [
        {
          id: 1,
          children: [
            { id: 5, message: "Item 5" },
            { id: 6, message: "Item 6" },
            { id: 7, message: "Item 7" },
            { id: 8, message: "Item 8" },
          ],
        },
        {
          id: 2,
          children: [
            { id: 9, message: "Item 9" },
            { id: 10, message: "Item 10" },
            { id: 11, message: "Item 11" },
            { id: 12, message: "Item 12" },
          ],
        },
        {
          id: 3,
          children: [
            { id: 13, message: "Item 13" },
            { id: 14, message: "Item 14" },
            { id: 15, message: "Item 15" },
            { id: 16, message: "Item 16" },
          ],
        },
      ],
      items2: [
        { id: 13, message: "Item 13" },
        { id: 14, message: "Item 14" },
        { id: 15, message: "Item 15" },
        { id: 16, message: "Item 16" },
      ],
      myObject: {
        title: "Vue에서 목록을 작성하는 방법",
        author: "홍길동",
        publishedAt: "2016-04-10",
      },
      message: "",
      firstName: "Jiheon",
      lastName: "Kim",
      count: 0,
      textStyle: {
        color: "#FF0000",
      },
      checked: true,
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
  computed: {
    isChecked() {
      return this.checked ? "checked" : "unchecked";
    },
    isVisible() {
      return this.visible ? "truthy" : "falsy";
    },
    fullName() {
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
  },

  methods: {
    handleInput(e: Event) {
      this.title = (e.target as HTMLInputElement).value;
    },
    handleCheck() {
      this.checked = !this.checked;
    },
    handleClick() {
      this.message = "vuelite";
    },
    fullNameMethod() {
      return this.firstName + " + " + this.lastName;
    },
    addItem(value: any) {
      /* 
      배열을 새로 할당하면 기존에 Reactity를 주입해놓은 기존의 배열이 
      새로 할당되면서 참조가 바뀌기 때문에 변경된 배열을 감지하지 못하는것 같다
      */

      this.myObject["newValue"] = "newValue";
      // this.myObject.title = "change Title";

      // this.items.push({ id: 1, message: `Item ${this.title}` });
      // this.title = "";
    },
    addArrayItem() {
      this.items.push({ id: 10, message: `Item 10` });
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

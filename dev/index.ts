import Vuelite from "../src/index";

Vuelite.component("my-component", {
  props: ["propsdata"],
  el: "#my-component",
  data() {
    return {
      message: "message",
      count: 5,
    };
  },
  methods: {
    increase() {
      this.count++;
    },
  },
});

const vm = new Vuelite({
  el: "#app",
  data() {
    return {
      title: "초기",
      hello: true,
      visible: true,
      visible2: false,
      parentMessage: "props로 부터 온 메시지",
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
      console.log("@@", this.$refs.myDiv.style.width);

      this.$refs.myDiv.style.width = "500px";

      // DOM 업데이트 전 크기 측정 (잘못된 결과 가능)
      const width = this.$refs.myDiv.clientWidth;
      console.log("Width before nextTick:", width); // 결과가 100px일 수 있음
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

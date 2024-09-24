import Vuelite, { createApp, ref, reactive, computed, watch } from "../src/index";

// const PropsViewer = {
//   props: ["propsdata", "handlecheck"],
//   el: "#propsviewer",
//   data() {
//     return {
//       message: "local message",
//     };
//   },
//   scopedStyles: {
//     section: {
//       border: "1px solid red",
//       margin: "1rem",
//       padding: "10px",
//     },
//   },
// };

// createApp({
//   components: {
//     "vue-propsviewer": PropsViewer,
//   },
//   setup() {
//     const message = ref("");
//     const visible = ref(true);
//     const items = reactive([
//       { id: 1, message: "Item 1" },
//       { id: 2, message: "Item 2" },
//       { id: 3, message: "Item 3" },
//       { id: 4, message: "Item 4" },
//     ]);
//     const uppercaseMessage = computed(() => {
//       return message.value.toUpperCase();
//     });
//     const addItem = () => {
//       items.push({ id: 10, message: "item 10" });
//     };
//     const handlecheck = () => {
//       visible.value = !visible.value;
//     };
//     watch(message, (newVal, oldVal) => {
//       // console.log(newVal, oldVal);
//     });
//     return { message, visible, items, handlecheck, addItem, uppercaseMessage };
//   },
// }).mount("#app");

Vuelite.component("global-component", {
  props: ["globaltitle"],
  el: "#global-component",
  data() {
    return {
      message: "global message",
      count: 5,
    };
  },
  methods: {
    increase() {
      this.count++;
    },
  },
});

const PropsViewer = {
  props: ["propsdata", "handlecheck"],
  el: "#propsviewer",
  data() {
    return {
      message: "local message",
    };
  },
  scopedStyles: {
    section: {
      border: "1px solid red",
      margin: "1rem",
      padding: "10px",
    },
  },
};

const vm = new Vuelite({
  el: "#app",
  components: {
    "vue-propsviewer": PropsViewer,
  },
  data() {
    return {
      title: "title",
      hello: true,
      visible: true,
      message: "parent message",
      inputValue: "",
      objectBind: {
        id: "testId",
        class: "testClass",
        customKey: "customValue",
      },
      isDisabled: true,
      count: 1,
      itemCount: "",
      items: [
        { id: 1, message: "Item 1" },
        { id: 2, message: "Item 2" },
        { id: 3, message: "Item 3" },
        { id: 4, message: "Item 4" },
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
    handlecheck() {
      this.visible = !this.visible;
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
    fullNameMethod() {
      return this.firstName + " + " + this.lastName;
    },
    fullNameMethod2() {
      return 3 + 2;
    },
    addItem(value: any) {
      /*
      배열을 새로 할당하면 기존에 Reactity를 주입해놓은 기존의 배열이
      새로 할당되면서 참조가 바뀌기 때문에 변경된 배열을 감지하지 못하는것 같다
      */
      this.items.push({ id: 10, message: `Item 10` });

      // this.myObject = {
      //   title: "Vue에서 목록을 작성하는 방법",
      //   author: "홍길동",
      // };
    },
    getRandom() {
      // this.

      return Math.random().toFixed(3);
    },
  },
  styles: {
    "#app": {
      border: "1px solid blue",
      borderRadius: "5px",
      padding: "10px",
      margin: "3rem",
    },
    ".title": {
      fontWeight: "bold",
    },
  },
});

// console.log(vm);

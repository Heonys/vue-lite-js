import Vuelite from "../src/render";
import { ViewModel } from "../src/core";

const vm = ViewModel.get({
  // el: document.querySelector("#target")!,
  isStop: false,
  changeContents() {
    this.wrapper.styles.background = `rgb(${Math.random() * 150 + 100},${Math.random() * 150 + 100},${Math.random() * 150 + 100})`;
    this.contents.properties.innerHTML = Math.random().toString(16).replace(".", "");
    this.list.template.data.forEach(({ item: { styles, properties } }) => {
      properties.innerHTML = Math.random().toString(16).replace(".", "");
      styles.background = `rgb(${Math.random() * 150 + 100},${Math.random() * 150 + 100},${Math.random() * 150 + 100})`;
    });
  },
  wrapper: ViewModel.get({
    styles: {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
    events: {
      click(e: Event, vm: ViewModel) {
        vm.parent.isStop = true;
      },
    },
  }),
  title: ViewModel.get({
    properties: {
      innerHTML: "Title",
    },
  }),
  contents: ViewModel.get({
    properties: {
      innerHTML: "Contents",
    },
  }),
  list: ViewModel.get({
    template: {
      name: "listItem",
      data: "1,2,3,4,5,6".split(",").map((v) =>
        ViewModel.get({
          item: ViewModel.get({
            styles: { background: "#fff" },
            properties: { innerHTML: "item " + v },
          }),
        }),
      ),
    },
  }),
});

// TODO: el을 vm안에 넣기
// TODO: data-viewmodel 속성 v-model 또는 v:key 이런식으로 바인딩 하도록 바꾸기
new Vuelite(document.querySelector("#target")!, vm);

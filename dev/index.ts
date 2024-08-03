import Vuelite from "../src/core/render";
import { ViewModel } from "../src/core/viewmodel";

const vm = ViewModel.get({
  // el: document.querySelector("#target")!,
  isStop: false,
  changeContents() {
    this.contents.properties.innerHTML = Math.random().toString(16).replace(".", "");
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
});

// TODO: el을 vm안에 넣기
new Vuelite(document.querySelector("#target")!, vm);

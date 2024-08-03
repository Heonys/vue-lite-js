import Vuelite from "../src/render";
import { ViewModel } from "../src/core";

// TODO: vuelite에 객체를 전달하고 내부적으로 따로 파싱하기

new Vuelite(
  document.querySelector("#target")!,
  ViewModel.get({
    isStop: false,
    changeContents() {
      // this.wrapper.styles.background = `rgb(${Math.random() * 150 + 100},${Math.random() * 150 + 100},${Math.random() * 150 + 100})`;
      // this.contents.properties.innerHTML = Math.random().toString(16).replace(".", "");
      this.list.template.data.forEach(({ item: { styles, properties } }) => {
        properties.innerHTML = Math.random().toString(16).replace(".", "");
        // styles.background = `rgb(${Math.random() * 150 + 100},${Math.random() * 150 + 100},${Math.random() * 150 + 100})`;
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
        data: [
          ViewModel.get({
            key: "data1",
            item: ViewModel.get({
              // styles: { background: "#fff" },
              properties: { innerHTML: "item1" },
            }),
          }),
          ViewModel.get({
            key: "data2",
            item: ViewModel.get({
              // styles: { background: "#fff" },
              properties: { innerHTML: "item2" },
            }),
          }),
        ],
      },
    }),
  }),
);

/*

Vuelite({
  data(){
    name: "jiheon"
  },
  mothod(){
    run() {}
  },
  style(){
     # 이게최선? 
  }

})


-> 스캐너가 item을 만들면 순서대로 videmodel을 바인딩해야 하나?
 */

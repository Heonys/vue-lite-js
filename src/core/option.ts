import { ViewItem } from "./binder";
import { ViewModel } from "./viewmodel";

export interface Options {
  el: string;
  data?: () => {
    [Key: string]: any;
  };
  methods?: {
    [Key: string]: Function;
  };
  computed?: {
    [Key: string]: Function;
  };
  watch?: {};
  styles?: {
    [K: string]: any;
  };
}

export class OptionParser {
  static parse(options: Options, binderItems: ViewItem[]): ViewModel {
    /* 
  
      우선 items에 있는 모든 reactive한 값들은 전부 
      
      */

    return ViewModel.get({
      "1": ViewModel.get({
        styles: {
          width: "50%",
          background: "#ffa",
          cursor: "pointer",
        },
        events: {
          click(e: Event, vm: ViewModel) {},
        },
      }),
      "2": ViewModel.get({
        properties: {
          innerHTML: "Title",
        },
      }),
      "3": ViewModel.get({
        properties: {
          innerHTML: "Contents01",
        },
      }),
      "4": ViewModel.get({
        properties: {
          value: "hello",
        },
        // TODO: 이거 데이터들을 전부 한곳에 모아두고 거기서 바꾸는 걸로 해야할듯 (경로 문제)
        // 실제 DOM이 변경되었을때 VM도 갱신해주는 부분
        events: {
          input(e: InputEvent, vm: ViewModel) {
            const target = e.target as HTMLInputElement;
            vm.parent["4"].properties.value = target.value;
          },
        },
      }),
      "5": ViewModel.get({
        styles: {
          color: "#FF0000",
        },
      }),
    });
  }
}

// ⭐ 이렇게 직접 할당하면 data타입의 반환값인 T를 추론못함
// const option2: Option = {
//   data() {
//     return {
//       name: "jiheon",
//     };
//   },
//   methods: {
//     name2() {},
//     name() {}, // typeError
//   },
// };

import { Binder, ViewModel } from "./core/index";
import { Options } from "./core/option";
import { injectReactive } from "./core/reactive";
import { VueScanner2 } from "./core/scanner";
import { NodeVisitor } from "./core/visitor";

// render 파일 이름 바꿔야할 듯

// 이게 결국 Viewmodel이 됨
export class Vuelite {
  el: HTMLElement;
  options: Options;
  [customKey: string]: any;

  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;

    // const scanner = new VueScanner(new DomVisitor());
    // const binder = scanner.scan(this.el);

    injectReactive(this); // 반응성 주입
    const scanner2 = new VueScanner2(new NodeVisitor());
    const binder2 = scanner2.scan(this);

    /* 

    현재 option으로 주입된 데이터들은 전부 반응성이 추가된 상황 
    추가적으로 setter에서 변화가 일어날때 Dep와 같은 클래스를 만들어주고 
    Watcher에서 


    여기서 binder에서 vm(this)을 전달하는 식이 필요할 듯 
    binder.watch(this)
    */

    //  ⭐⭐⭐
    // 3. 뷰모델 생성
    // 4. binder에 뷰모델 바인딩

    // const viewmodel = OptionParser.parse(options, [...binder.binderItems]);
    // new VueliteBinder(binder, viewmodel);
  }
}

// export default class VueliteBinder {
//   static setBaseProcessor(binder: Binder) {
//     baseProcessor.forEach((process) => binder.addProcessor(process));
//     return binder;
//   }

//   constructor(
//     private binder: Binder,
//     private vm: ViewModel,
//   ) {
//     VueliteBinder.setBaseProcessor(this.binder);
//     this.binder.watch(this.vm);
//   }
// }

/* 
⭐Dep의 역할 
1. 구독자 관리
2. 의존성 변경
3. 변경 알림 
*/

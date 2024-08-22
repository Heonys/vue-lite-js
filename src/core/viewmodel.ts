import { Options } from "./option";
import { injectReactive } from "./reactive";
import { VueScanner, NodeVisitor } from "./index";

export class Vuelite {
  el: HTMLElement;
  options: Options;
  [customKey: string]: any;

  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;

    injectReactive(this); // 반응성 주입
    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);

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

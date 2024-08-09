import { Binder, ViewModel } from "./core/index";
import { Options } from "./core/option";
import { baseProcessor } from "./core/processor";
import { injectReactive } from "./core/reactive";
import { VueScanner2 } from "./core/scanner";
import { NodeVisitor } from "./core/visitor";

// render 파일 이름 바꿔야할 듯

// 이게 결국 Viewmodel이 됨
export class Vuelite {
  el: HTMLElement;
  options: Options;

  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;

    // const scanner = new VueScanner(new DomVisitor());
    // const binder = scanner.scan(this.el);

    const scanner2 = new VueScanner2(new NodeVisitor());
    const binder2 = scanner2.scan(this.el);

    // 이거 자체가 observe이니까 그냥 Reactivity로 나눌게 아니라 그냥 이게 옵저버인가?
    injectReactive(this);

    //  ⭐⭐⭐
    // 1. 일단 옵션 데이터 정제하기
    // 2. 프록시 설정
    // 3. 뷰모델 생성
    // 4. binder에 뷰모델 바인딩

    // const viewmodel = OptionParser.parse(options, [...binder.binderItems]);
    // new VueliteBinder(binder, viewmodel);
  }
}

export default class VueliteBinder {
  static setBaseProcessor(binder: Binder) {
    baseProcessor.forEach((process) => binder.addProcessor(process));
    return binder;
  }

  constructor(
    private binder: Binder,
    private vm: ViewModel,
  ) {
    VueliteBinder.setBaseProcessor(this.binder);
    this.binder.watch(this.vm);
  }
}

/* 
⭐Dep의 역할 
1. 구독자 관리
2. 의존성 변경
3. 변경 알림 
*/

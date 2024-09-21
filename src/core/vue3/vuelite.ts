import { Options } from "../viewmodel/option";
import Vuelite from "../viewmodel/vuelite";

/* 
일단 옵션이 달라져야하고
그에따라서 vuelite 인스턴스도 준비단계를 거쳐야함
*/
export function createApp<Data = {}>(options: Options<Data>) {
  const app = new Vuelite(options);

  return {
    ...app,
    use() {},
    directive() {},
    mixin() {},
    component() {},
    mount(el: string) {
      // 이 시점에 템플릿을 컴파일
    },
  };
}

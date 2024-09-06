import { typeOf } from "@/utils/format";
import { ForLoop } from "./forLoop";

/* 
 여기서는 단순히 템플릿 표현식 안에있는 값들을 계산해서 주입하도록 할 수 있지만,
 안쪽에 훨씬더 복잡한 마크다운이 되어있을 수 있을 뿐더러, 다른 디렉티브가 존재할 수 있다

 Visitor에서 v-for을 만나면 안쪽에 자식들은 파싱을 하지않도록 했기때문에 
 여기로 들어오는 el안쪽에 있는 디렉티브는 현재 파싱이 되어있지도 않기때문에 

 여기서 스캐너를 다시 생성해서 el을 파싱하는 절차가 필요하지 않을까? 

 const scanner = new VueScanner(new NodeVisitor());
 내부적으로 디렉티브와 템플릿을 사용하는쪽에 Dep과 옵저버의 관계가 형성될 것이고,

 이제 여기서는 context에 따른 계산만 하면되지않을까? 

 그러면 scanner를 context의 수만큼 반복되는거 겠는데

*/

/* 
그니까 여기서 할 수 있는게 지금
1. context의 값을 채워서 el을 만들어서 반환한다
2. el을 가지고 scanner로 다시 스캔하고 새로운 디렉티브를 만든다
*/

function createContext(alias: string[], exp: string, index: number, data: any) {
  if (typeOf(data) === "object") {
    const key = Object.keys(data)[index];
    switch (alias.length) {
      case 1: {
        return { [alias[0]]: `${exp}.${key}` };
      }
      case 2: {
        return { [alias[0]]: `${exp}.${key}`, [alias[1]]: `${key}` };
      }
      case 3: {
        return {
          [alias[0]]: `${exp}.${key}`,
          [alias[1]]: `${key}`,
          [alias[2]]: index,
        };
      }
      default: {
        return {};
      }
    }
  } else if (typeOf(data) === "number") {
    switch (alias.length) {
      case 1: {
        return { [alias[0]]: index + 1 };
      }
      case 2: {
        return { [alias[0]]: index + 1, [alias[1]]: index };
      }
      default: {
        return {};
      }
    }
  } else {
    switch (alias.length) {
      case 1: {
        return { [alias[0]]: `${exp}[${index}]` };
      }
      case 2: {
        return { [alias[0]]: `${exp}[${index}]`, [alias[1]]: index };
      }
      default: {
        return {};
      }
    }
  }
}

export function assignContext(loop: ForLoop, el: HTMLElement, listExp: string, index: number) {
  const alias = loop.alias;
  const data = loop.data;
  const context = createContext(alias, listExp, index, data);

  console.log(context);

  /* 
  작성중 ... 
  */
  return el;
}

export function calculateLoopSize(value: any) {
  switch (typeOf(value)) {
    case "string":
    case "array": {
      return value.length;
    }
    case "object": {
      return Object.values(value).length;
    }
    case "number": {
      return Math.max(0, Number(value));
    }
    default: {
      return 0;
    }
  }
}

// class Context {
//   key?: string;
//   alias: string[];
//   constructor(
//     public loop: ForLoop,
//     public el: HTMLElement,
//     listExp: string,
//     index: number,
//   ) {
//     this.alias = loop.alias;
//     if (loop.hasKey) {
//       this.key = el.getAttribute(":key") || el.getAttribute("v-bind:key");
//     }
//   }
// }

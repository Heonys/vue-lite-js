import { isEmptyObject } from "../utils/index";

const DirectiveNames = ["bind", "model", "text", "style", "on"];
const directiveReg = /^v-(\w+)(:(\w+))?$/;

type DirectiveMapValue = {
  key: string;
  modifier: string | null;
  value: string;
};

export class Directive {
  static getDirectiveMap(el: Element) {
    const directiveMap: Record<string, DirectiveMapValue> = {};

    Array.from(el.attributes).forEach(({ name, value }) => {
      const match = name.match(directiveReg);

      if (match) {
        directiveMap[match[1]] = {
          key: match[1],
          modifier: match[3] || null,
          value,
        };
      }
    });

    return isEmptyObject(directiveMap) ? null : directiveMap;
  }

  // 🚩이미 이시점에 el에는 속성이 없음 (왜냐하면 스캐너에서 가져올때 다 지우니까)
  // static isDirective(el: Element) {
  //   Array.from(el.attributes).forEach((attr) => {
  //     const property = attr.name;
  //     const directiveMatch = property.match(directiveReg);

  //     if (directiveMatch) {
  //       const directiveName = directiveMatch[1] as keyof typeof Directive;

  //       if (DirectiveNames.includes(directiveName)) {
  //         (Directive[directiveName] as Function)();
  //       }
  //       el.removeAttribute(property);
  //     }
  //   });
  // }

  static bind() {
    // 단방향 바인딩
  }
  static model() {
    // 양방향 바인딩
  }
  static text() {
    // 사실상 {{ }}을 사용한 템플릿 구문과 동일
  }
  static styles() {
    // 로더를 따로 사용해서 vue 확장자를 지원하지 않기때문에 styles을 뷰모델에서 관리
  }
  static eventHandler() {
    // @click과 같은 이벤트 핸들러 처리 디렉티브
  }
}

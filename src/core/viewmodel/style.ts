import Vuelite from "./vuelite";

/* 
https://stackoverflow.com/questions/31126111/programatically-create-new-css-rules-in-a-stylesheet
*/
class StyleRule {
  rule: CSSStyleRule;
  constructor(sheet: CSSStyleSheet) {
    const len = sheet.cssRules.length;
    sheet.insertRule("*{}", len);
    this.rule = sheet.cssRules[len] as CSSStyleRule;
  }
  selector(selector: string) {
    this.rule.selectorText = selector;
  }
  setStyle(key: string, value: any) {
    (this.rule.style as any)[key] = value;
  }
}

export function injectStyleSheet(vm: Vuelite) {
  const { styles } = vm.options;
  const styleElement = document.createElement("style");
  document.head.appendChild(styleElement);

  Object.entries(styles).forEach(([selector, styles]) => {
    const rule = new StyleRule(styleElement.sheet);
    rule.selector(selector);
    Object.entries(styles).forEach(([key, value]) => {
      rule.setStyle(key, value);
    });
  });
}

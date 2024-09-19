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

export function createStyleSheet(vm: Vuelite) {
  const { styles, scopedStyles } = vm.$options;
  if (!styles && !scopedStyles) return;

  if (styles) {
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

  if (scopedStyles) {
    const scopedStyleElement = document.createElement("style");
    document.head.appendChild(scopedStyleElement);
    const scopeId = generateScopeId();

    Object.entries(scopedStyles).forEach(([selector, style]) => {
      const scopedSelector = `*[data-scopeid="${scopeId}"] ${selector}`;
      const rule = new StyleRule(scopedStyleElement.sheet);
      rule.selector(scopedSelector);
      Object.entries(style).forEach(([key, value]) => {
        rule.setStyle(key, value);
      });
    });

    if (vm.$el instanceof HTMLElement) {
      vm.$el.setAttribute("data-scopeid", scopeId);
    }
  }
}

function generateScopeId() {
  return "v-" + Math.random().toString(36).substring(2, 7);
}

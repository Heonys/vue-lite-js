import { DirectiveKey } from "../core/binder";

function extractDirective(attr: string) {
  const regExp = /^v-(\w+)(:(\w+))?$/;
  const match = attr.match(regExp);
  return { key: match[1] as DirectiveKey, modifier: match[3] || null };
}

function extractTemplate(text: string) {
  const regExp = /{{\s*(.*?)\s*}}/;
  const match = regExp.exec(text);
  return match ? match[1] : null;
}

function isDirective(attr: string) {
  return attr.indexOf("v-") === 0;
}

function isEventDirective(dir: string) {
  return dir.indexOf("v-on") === 0;
}

export const directiveUtils = {
  extractDirective,
  extractTemplate,
  isDirective,
  isEventDirective,
};

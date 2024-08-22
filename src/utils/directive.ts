import type { DirectiveKey } from "../types/directive";

export function extractDirective(attr: string) {
  const regExp = /^v-(\w+)(:(\w+))?$/;
  const match = attr.match(regExp);
  return { key: match[1] as DirectiveKey, modifier: match[3] || null };
}

export function extractTemplate(text: string) {
  const regExp = /{{\s*(.*?)\s*}}/;
  const match = regExp.exec(text);
  return match ? match[1] : null;
}

export function isDirective(attr: string) {
  return attr.indexOf("v-") === 0;
}

export function isEventDirective(dir: string) {
  return dir.indexOf("v-on") === 0;
}

import type { DirectiveKey } from "../types/directive";
import { isElementNode, isTextNode } from "./format";

export function extractDirective(attr: string) {
  const regExp = /^v-(\w+)(:(\w+))?$/;
  const match = attr.match(regExp);
  return { key: match[1] as DirectiveKey, modifier: match[3] || null };
}

export function extractTemplate(text: string) {
  const regExp = /{{\s*(.*?)\s*}}/g;
  const matched = [];
  let match;

  while ((match = regExp.exec(text)) !== null) {
    matched.push(match[1]);
  }

  return matched;
}

export function isDirective(attr: string) {
  return attr.indexOf("v-") === 0;
}

export function isEventDirective(dir: string) {
  return dir.indexOf("v-on") === 0;
}

export const isReactiveNode = (node: Node) => {
  if (isElementNode(node)) {
    const attributes = node.attributes;
    return Array.from(attributes).some((attr) => isDirective(attr.name));
  } else if (isTextNode(node)) {
    const textContent = node.textContent || "";
    return extractTemplate(textContent) ? true : false;
  }
};

function escapeParentheses(string: string): string {
  return string.replace(/[()]/g, "\\$&");
}

export const replaceTemplate = (template: string, key: string, value: string) => {
  // console.log(template, key, value);

  const regex = new RegExp(`{{\\s*${escapeParentheses(key)}\\s*}}`, "g");
  return template.replace(regex, value);
};

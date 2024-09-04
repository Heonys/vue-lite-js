import { directiveNames, type DirectiveKey } from "../types/directive";
import { isElementNode, isTextNode } from "./format";

export function extractDirective(attr: string) {
  if (isShortcut(attr)) {
    if (attr.slice(0, 1) === ":") {
      return { key: "bind" as DirectiveKey, modifier: attr.slice(1) };
    } else {
      return { key: "eventHandler" as DirectiveKey, modifier: attr.slice(1) };
    }
  } else {
    const regExp = /^v-([\w-]+)(:(\w+))?$/;
    const match = attr.match(regExp);
    return { key: match[1] as DirectiveKey, modifier: match[3] || null };
  }
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

function isShortcut(name: string) {
  return [":", "@"].includes(name[0]);
}

export function isDirective(attr: string) {
  return attr.startsWith("v-") || attr.startsWith(":") || attr.startsWith("@");
}

export function isEventDirective(name: string) {
  return name.startsWith("v-on:") || name.startsWith("@");
}

export const isReactiveNode = (node: Node) => {
  if (isElementNode(node)) {
    const attributes = node.attributes;
    return Array.from(attributes).some((attr) => isDirective(attr.name));
  } else if (isTextNode(node)) {
    const textContent = node.textContent || "";
    return extractTemplate(textContent).length > 0 ? true : false;
  }
};

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const replaceTemplate = (template: string, key: string, value: string) => {
  const regex = new RegExp(`{{\\s*${escapeRegExp(key)}\\s*}}`, "g");
  return template.replace(regex, value);
};

export const isValidDirective = (name: string): name is DirectiveKey => {
  return (directiveNames as readonly string[]).includes(name);
};

export function shouldSkipChildren(node: Node) {
  return node instanceof HTMLElement && node.hasAttribute("v-for");
}

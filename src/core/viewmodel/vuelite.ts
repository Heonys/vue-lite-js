import { VueScanner, NodeVisitor, injectReactive, injectStyleSheet } from "../index";
import { createDOMTemplate } from "@utils/common";
import { type Options } from "./option";

export class Vuelite {
  el: HTMLElement;
  template?: Element;
  options: Options;
  [customKey: string]: any;

  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;
    this.template = createDOMTemplate(options.template);

    injectReactive(this);
    injectStyleSheet(this);

    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);
  }
}

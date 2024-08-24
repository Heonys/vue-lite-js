import { VueScanner, NodeVisitor, injectReactive, injectStyleSheet } from "./index";
import { type Options } from "./option";

export class Vuelite {
  el: HTMLElement;
  options: Options;
  [customKey: string]: any;

  constructor(options: Options) {
    this.el = document.querySelector(options.el);
    this.options = options;

    injectReactive(this);
    injectStyleSheet(this);

    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);
  }
}

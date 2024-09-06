import { createDOMTemplate } from "@utils/common";
import { type Options } from "./option";
import { injectReactive } from "../reactive/reactive";
import { injectStyleSheet } from "./style";
import { VueScanner } from "../binder/scanner";
import { NodeVisitor } from "../binder/visitor";

export default class Vuelite<Data = {}, Methods = {}, Computed = {}> {
  el: HTMLElement;
  template?: Element;
  options: Options<Data, Methods, Computed>;
  deferredTasks: Function[] = [];
  static context?: Record<string, any>;
  [customKey: string]: any;

  constructor(options: Options<Data, Methods, Computed>) {
    this.el = document.querySelector(options.el);
    this.options = options;
    this.template = createDOMTemplate(options.template);

    injectReactive(this);
    injectStyleSheet(this);

    const scanner = new VueScanner(new NodeVisitor());
    scanner.scan(this);
  }
}

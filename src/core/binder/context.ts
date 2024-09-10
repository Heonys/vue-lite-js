import { ForLoop } from "./forLoop";
import Vuelite from "../viewmodel/vuelite";
import { VueScanner } from "./scanner";
import { NodeVisitor } from "./visitor";
import { createContext } from "@/utils/context";

export class Context {
  scanner: VueScanner;
  constructor(public loop: ForLoop) {
    this.scanner = new VueScanner(new NodeVisitor());
  }

  bind(el: HTMLElement, index: number, data: any) {
    const { alias, vm, loopEffects, listExp, parentContext } = this.loop;
    const context = { ...parentContext, ...createContext(alias, listExp, index, data) };

    Vuelite.context = context;
    const container = this.scanner.scanPartial(vm, el, loopEffects);
    Vuelite.context = null;

    return container;
  }
}

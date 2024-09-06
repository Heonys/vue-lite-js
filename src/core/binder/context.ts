import { ForLoop } from "./forLoop";
import Vuelite from "../viewmodel/vuelite";
import { VueScanner } from "./scanner";
import { NodeVisitor } from "./visitor";
import { createContext } from "@/utils/context";

export function bindContext(loop: ForLoop, el: HTMLElement, listExp: string, index: number) {
  const { alias, data, vm } = loop;
  const context = createContext(alias, listExp, index, data);

  Vuelite.context = context;
  const scanner = new VueScanner(new NodeVisitor());
  const container = scanner.scanPartial(vm, el);
  Vuelite.context = null;

  return container;
}
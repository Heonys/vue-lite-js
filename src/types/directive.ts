import { Vuelite } from "../core/viewmodel";

type DirectiveNames = ["bind", "model", "text", "style", "class", "html", "eventHandler"];
export type DirectiveKey = DirectiveNames[number];

export type DirectiveTypes = {
  [Method in Exclude<DirectiveKey, "bind">]: (
    node: Node,
    vm: Vuelite,
    exp: string,
    modifier: string,
  ) => void;
} & {
  bind: (node: Node, vm: Vuelite, exp: string, modifier: string, updater?: Function) => void;
};

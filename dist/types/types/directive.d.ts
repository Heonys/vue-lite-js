import Vuelite from "../core/viewmodel/vuelite";
export declare const directiveNames: readonly ["bind", "model", "text", "style", "class", "html", "eventHandler", "if", "else", "show"];
export type DirectiveKey = (typeof directiveNames)[number];
export type DirectiveTypes = {
    [Method in Exclude<DirectiveKey, "bind">]: (node: Node, vm: Vuelite, exp: string, modifier: string) => void;
} & {
    bind: (node: Node, vm: Vuelite, exp: string, modifier: string, updater?: Function) => void;
};

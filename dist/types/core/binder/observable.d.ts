import Vuelite from "../viewmodel/vuelite";
export declare class Observable {
    vm: Vuelite;
    node: Node;
    contextTask?: Function[];
    constructor(vm: Vuelite, node: Node, contextTask?: Function[]);
    directiveBind(el: Element): void;
    templateBind(node: Node): void;
}

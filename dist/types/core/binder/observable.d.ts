import Vuelite from "../viewmodel/vuelite";
export declare class Observable {
    vm: Vuelite;
    node: Node;
    loopEffects?: Function[];
    constructor(vm: Vuelite, node: Node, loopEffects?: Function[]);
    directiveBind(el: Element): void;
    templateBind(node: Node): void;
}

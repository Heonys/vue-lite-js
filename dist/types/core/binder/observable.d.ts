import Vuelite from "../viewmodel/vuelite";
export type ObserverType = "Template" | "Directive" | "Component";
export declare class Observable {
    vm: Vuelite;
    node: Node;
    loopEffects?: Function[];
    constructor(vm: Vuelite, node: Node, type: ObserverType, loopEffects?: Function[]);
    directiveBind(el: Element): void;
    templateBind(node: Node): void;
}

import { Vuelite } from "../index";
export declare class Observable {
    vm: Vuelite;
    node: Node;
    constructor(vm: Vuelite, node: Node);
    directiveBind(el: Element): void;
    templateBind(node: Node): void;
}

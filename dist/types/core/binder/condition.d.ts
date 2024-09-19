import Vuelite from "../viewmodel/vuelite";
export declare class Condition {
    vm: Vuelite;
    el: HTMLElement;
    exp: any;
    parent: HTMLElement | DocumentFragment;
    childIndex: number;
    ifFragment: DocumentFragment;
    elseFragment?: DocumentFragment;
    elseElement?: HTMLElement;
    constructor(vm: Vuelite, el: HTMLElement, exp: any);
    render(): void;
    checkForElse(): void;
    updater(value: any): void;
}

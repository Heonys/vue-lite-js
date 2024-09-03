import Vuelite from "../viewmodel/vuelite";
export declare class Condition {
    vm: Vuelite;
    el: HTMLElement;
    name: string;
    exp: any;
    parent: HTMLElement;
    childIndex: number;
    ifFragment: DocumentFragment;
    elseFragment?: DocumentFragment;
    elseElement?: HTMLElement;
    constructor(vm: Vuelite, el: HTMLElement, name: string, exp: any);
    render(): void;
    checkForElse(): void;
    updater(value: any): void;
}

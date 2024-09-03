import Vuelite from "../viewmodel/vuelite";
export declare class Condition {
    vm: Vuelite;
    el: HTMLElement;
    name: string;
    exp: any;
    parent: HTMLElement;
    childIndex: number;
    isVisible: boolean;
    fragment: DocumentFragment;
    constructor(vm: Vuelite, el: HTMLElement, name: string, exp: any);
    render(): void;
    updater(value: any): void;
}

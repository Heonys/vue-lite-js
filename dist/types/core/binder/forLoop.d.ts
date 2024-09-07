import Vuelite from "../viewmodel/vuelite";
export declare class ForLoop {
    vm: Vuelite;
    el: HTMLElement;
    exp: any;
    alias: string[];
    parent: HTMLElement;
    listExp: string;
    constructor(vm: Vuelite, el: HTMLElement, exp: any);
    render(): void;
    updater(value: any): void;
}

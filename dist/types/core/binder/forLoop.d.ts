import Vuelite from "../viewmodel/vuelite";
export declare class ForLoop {
    vm: Vuelite;
    el: HTMLElement;
    exp: any;
    alias: string[];
    parent: HTMLElement;
    data: any;
    constructor(vm: Vuelite, el: HTMLElement, exp: any);
    render(el: HTMLElement, listExp: string): void;
}

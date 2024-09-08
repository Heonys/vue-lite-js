import Vuelite from "../viewmodel/vuelite";
export declare class ForLoop {
    vm: Vuelite;
    el: HTMLElement;
    exp: any;
    alias: string[];
    parent: HTMLElement;
    listExp: string;
    startIndex: number;
    endIndex: number;
    contextTask: Function[];
    constructor(vm: Vuelite, el: HTMLElement, exp: any);
    render(): void;
    clearTask(): void;
    updater(value: any): void;
}

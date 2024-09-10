import Vuelite from "../viewmodel/vuelite";
export declare class ForLoop {
    vm: Vuelite;
    el: HTMLElement;
    exp: any;
    parentContext: Record<string, any>;
    alias: string[];
    parent: HTMLElement;
    listExp: string;
    startIndex: number;
    endIndex: number;
    loopEffects: Function[];
    constructor(vm: Vuelite, el: HTMLElement, exp: any, parentContext: Record<string, any>);
    render(): void;
    updater(value: any): void;
    clearEffects(): void;
}

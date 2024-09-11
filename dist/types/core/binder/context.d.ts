import { ForLoop } from "./forLoop";
import { VueScanner } from "./scanner";
export declare class Context {
    loop: ForLoop;
    data: any;
    scanner: VueScanner;
    constructor(loop: ForLoop, data: any);
    bind(el: HTMLElement, index: number): HTMLElement;
}

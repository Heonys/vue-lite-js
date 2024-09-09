import { ForLoop } from "./forLoop";
import { VueScanner } from "./scanner";
export declare class Context {
    loop: ForLoop;
    scanner: VueScanner;
    constructor(loop: ForLoop);
    bind(el: HTMLElement, index: number, data: any): HTMLElement;
}

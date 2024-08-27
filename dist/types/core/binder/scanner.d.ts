import Vuelite from "../viewmodel/vuelite";
import type { Visitor } from "./visitor";
declare abstract class Scanner {
    private visitor;
    constructor(visitor: Visitor);
    visit(action: Function, target: any): void;
    abstract scan(target: any): void;
}
export declare class VueScanner extends Scanner {
    private fragment;
    private node2Fragment;
    scan(vm: Vuelite): void;
}
export {};

import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
export declare class Observer {
    private vm;
    private exp;
    name: string;
    node: Node;
    private onUpdate;
    private value;
    private deps;
    constructor(vm: Vuelite, exp: string, name: string, node: Node, onUpdate: (value: any, clone?: Node) => void);
    addDep(dep: Dep): void;
    getterTrigger(): any;
    update(): void;
}

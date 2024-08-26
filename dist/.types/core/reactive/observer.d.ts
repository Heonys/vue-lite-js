import { Dep, Vuelite } from "../index";
export declare class Observer {
    private node;
    private vm;
    private exp;
    private onUpdate;
    private value;
    private deps;
    constructor(node: Node, vm: Vuelite, exp: string, onUpdate: (node: Node, value: any) => void);
    addDep(dep: Dep): void;
    getterTrigger(): any;
    update(): void;
}

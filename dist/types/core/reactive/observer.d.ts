import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
export declare class Observer {
    private vm;
    private exp;
    private onUpdate;
    private value;
    private deps;
    constructor(vm: Vuelite, exp: string, onUpdate: (value: any) => void);
    addDep(dep: Dep): void;
    getterTrigger(): any;
    update(): void;
}

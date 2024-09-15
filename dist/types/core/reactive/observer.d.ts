import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { WatchObject } from "../viewmodel/option";
export declare class Observer {
    private vm;
    private exp;
    private onUpdate;
    private value;
    private deps;
    constructor(vm: Vuelite, exp: string, onUpdate: (newVal: any, oldVal?: any) => void, watchOption?: Omit<WatchObject, "handler">);
    addDep(dep: Dep): void;
    getterTrigger(): any;
    update(): void;
}
export declare function createWatchers(vm: Vuelite): void;

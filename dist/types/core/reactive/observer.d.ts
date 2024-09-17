import { Dep } from "./dep";
import Vuelite from "../viewmodel/vuelite";
import { WatchOption } from "../viewmodel/option";
export declare class Observer {
    private vm;
    private exp;
    private onUpdate;
    private value;
    private deps;
    isMethods: boolean;
    constructor(vm: Vuelite, exp: string, onUpdate: (newVal: any, oldVal?: any) => void, watchOption?: WatchOption);
    addDep(dep: Dep): void;
    getterTrigger(): any;
    update(): void;
}
export declare function createWatcher(vm: Vuelite): void;

import { Updater } from "./updaters";
import Vuelite from "../viewmodel/vuelite";
export declare class Directive {
    vm: Vuelite;
    node: Node;
    exp: any;
    directiveName: string;
    modifier: string;
    constructor(name: string, vm: Vuelite, node: Node, exp: any, loopEffects?: Function[]);
    bind(updater?: Updater): void;
    model(): void;
    text(): void;
    style(): void;
    class(): void;
    html(): void;
    show(): void;
    on(): void;
    scheduleTask(key: string, task?: Function[]): void;
    selectUpdater(updater: Updater): Updater;
}

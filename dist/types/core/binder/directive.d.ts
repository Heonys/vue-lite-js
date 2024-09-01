import { Updater } from "./updaters";
import Vuelite from "../viewmodel/vuelite";
export declare class Directive {
    vm: Vuelite;
    node: Node;
    exp: any;
    directiveName: string;
    modifier: string;
    constructor(name: string, vm: Vuelite, node: Node, exp: any);
    bind(updater?: Updater): void;
    model(): void;
    text(): void;
    style(): void;
    class(): void;
    html(): void;
    eventHandler(): void;
}

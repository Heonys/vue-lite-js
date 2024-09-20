import { Options } from "../viewmodel/option";
import Vuelite from "../viewmodel/vuelite";
export declare function createApp<D = {}, M = {}, C = {}>(options: Options<D, M, C>): {
    use(): void;
    directive(): void;
    mixin(): void;
    component(): void;
    mount(el: string): void;
    $data: object;
    $el: HTMLElement | DocumentFragment;
    $options: Options<D, M, C>;
    $props: Record<string, any>;
    $parent: Vuelite | null;
    $refs: {
        [name: string]: Element;
    };
    $components: import("../viewmodel/option").ComponentMap;
    componentsNames: Record<string, Options>;
    updateQueue: Function[];
    deferredTasks: Function[];
};
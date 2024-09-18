import { Options } from "../viewmodel/option";
import Vuelite from "../viewmodel/vuelite";
export declare function createApp<D = {}, M = {}, C = {}>(options: Options<D, M, C>): {
    use(): void;
    directive(): void;
    mixin(): void;
    component(): void;
    mount(el: string): void;
    $data: object;
    $el: HTMLElement;
    $options: Options<D, M, C>;
    $props: Record<string, any>;
    $parent: Vuelite | null;
    $refs: {
        [name: string]: Element;
    };
    updateQueue: Function[];
    deferredTasks: Function[];
};

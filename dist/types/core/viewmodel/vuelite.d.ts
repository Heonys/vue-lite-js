import { ComponentMap, ComponentPublicInstance, WatchCallback, WatchOption, Options } from "./option";
import { Lifecycle } from "./lifecycle";
export default class Vuelite<D = {}, M = {}, C = {}> extends Lifecycle<D, M, C> implements ComponentPublicInstance {
    $data: object;
    $el: HTMLElement | DocumentFragment;
    $options: Options<D, M, C>;
    $props: Record<string, any>;
    $parent: Vuelite | null;
    $refs: {
        [name: string]: Element;
    };
    $components: ComponentMap;
    componentsNames: Record<string, Options>;
    updateQueue: Function[];
    static context?: Record<string, any>;
    [customKey: string]: any;
    constructor(options: Options<D, M, C>);
    setupDOM(options: Options<D, M, C>): void;
    render(): void;
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
    localComponents(options: Options): void;
    static globalComponentsNames: Record<string, Options>;
    static globalComponents: ComponentMap;
    static component(name: string, options: Options): void;
}

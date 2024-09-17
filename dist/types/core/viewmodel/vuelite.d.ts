import { ComponentPublicInstance, WatchCallback, WatchOption, type Options } from "./option";
import { Lifecycle } from "./lifecycle";
export default class Vuelite<D = {}, M = {}, C = {}> extends Lifecycle<D, M, C> implements ComponentPublicInstance {
    $data: object;
    $el: HTMLElement;
    template?: Element;
    $options: Options<D, M, C>;
    $refs: {
        [name: string]: Element;
    };
    updateQueue: Function[];
    static context?: Record<string, any>;
    [customKey: string]: any;
    constructor(options: Options<D, M, C>);
    render(): void;
    $watch(source: string, callback: WatchCallback, options?: WatchOption): void;
    $forceUpdate(): void;
}

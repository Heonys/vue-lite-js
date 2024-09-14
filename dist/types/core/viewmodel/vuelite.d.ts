import { type Options } from "./option";
import { Lifecycle } from "./lifecycle";
export default class Vuelite<D = {}, M = {}, C = {}> extends Lifecycle<D, M, C> {
    el: HTMLElement;
    template?: Element;
    options: Options<D, M, C>;
    virtual: Node;
    updateQueue: Function[];
    static context?: Record<string, any>;
    [customKey: string]: any;
    constructor(options: Options<D, M, C>);
    render(): void;
}

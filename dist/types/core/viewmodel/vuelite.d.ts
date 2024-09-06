import { type Options } from "./option";
export default class Vuelite<Data = {}, Methods = {}, Computed = {}> {
    el: HTMLElement;
    template?: Element;
    options: Options<Data, Methods, Computed>;
    deferredTasks: Function[];
    static context?: Record<string, any>;
    [customKey: string]: any;
    constructor(options: Options<Data, Methods, Computed>);
}

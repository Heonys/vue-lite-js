import { type Options } from "./option";
export default class Vuelite {
    el: HTMLElement;
    template?: Element;
    options: Options;
    [customKey: string]: any;
    constructor(options: Options);
}

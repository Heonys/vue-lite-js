import { Directive } from "./directive";
export type Updater = (node: Node, value: any) => void;
export declare const updaters: {
    text(this: Directive, node: Node, value: string): void;
    class(el: HTMLElement, value: any): void;
    style(el: HTMLElement, value: object): void;
    html(el: HTMLElement, value: string): void;
    inputCheckbox(el: HTMLInputElement, value: any): void;
    inputRadio(el: HTMLInputElement, value: any): void;
    inputValue(el: HTMLInputElement, value: any): void;
    inputMultiple(el: HTMLSelectElement, value: any): void;
    customBind(this: Directive, el: HTMLElement, value: any): void;
    objectBind(this: Directive, el: HTMLInputElement, value: any): void;
    show(el: HTMLElement, condition: any): void;
};

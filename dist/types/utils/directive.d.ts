import Vuelite from "@/core/viewmodel/vuelite";
import { type DirectiveKey } from "../types/directive";
import { ObserverType } from "@/core/binder/observable";
export declare function extractDirective(attr: string): {
    key: DirectiveKey;
    modifier: string;
};
export declare function extractTemplate(text: string): string[];
export declare function isDirective(attr: string): boolean;
export declare function isEventDirective(name: string): boolean;
export declare function checkObserverType(vm: Vuelite, node: Node): ObserverType;
export declare const isReactiveNode: (vm: Vuelite, node: Node) => boolean;
export declare const replaceTemplate: (template: string, key: string, value: string) => string;
export declare const isValidDirective: (name: string) => name is DirectiveKey;
export declare function shouldSkipChildren(node: Node): boolean;
export declare function removeLoopDirective(el: HTMLElement): void;

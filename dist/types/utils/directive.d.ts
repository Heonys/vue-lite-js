import { type DirectiveKey } from "../types/directive";
export declare function extractDirective(attr: string): {
    key: DirectiveKey;
    modifier: string;
};
export declare function extractTemplate(text: string): string[];
export declare function isDirective(attr: string): boolean;
export declare function isEventDirective(name: string): boolean;
export declare const isReactiveNode: (node: Node) => boolean;
export declare const replaceTemplate: (template: string, key: string, value: string) => string;
export declare const isValidDirective: (name: string) => name is DirectiveKey;

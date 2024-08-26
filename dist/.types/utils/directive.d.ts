import type { DirectiveKey } from "../types/directive";
export declare function extractDirective(attr: string): {
    key: DirectiveKey;
    modifier: string;
};
export declare function extractTemplate(text: string): string[];
export declare function isContainsTemplate(str: string): boolean;
export declare function isDirective(attr: string): boolean;
export declare function isEventDirective(dir: string): boolean;
export declare const isReactiveNode: (node: Node) => boolean;
export declare const replaceTemplate: (template: string, key: string, value: string) => string;

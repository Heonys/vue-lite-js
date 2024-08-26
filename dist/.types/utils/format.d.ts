export declare function isTernary(str: string): {
    condition: string;
    truthy: string;
    falsy: string;
};
export declare function isObjectFormat(str: string): boolean;
export declare function isFunctionFormat(str: string): string;
export declare const isObject: (data: any) => data is object;
export declare const isFunction: (data: any) => data is Function;
export declare function isQuotedString(str: string): boolean;
export declare function isHtmlFormat(str: string): boolean;
export declare const isElementNode: (node: Node) => node is HTMLElement;
export declare const isTextNode: (node: Node) => boolean;
export declare const isIncludeText: (node: HTMLElement) => boolean;
export declare const isDynamic: (str: string) => boolean;

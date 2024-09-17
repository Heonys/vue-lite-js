export declare function extractPath(obj: Record<PropertyKey, any>, path: string): any;
export declare function assignPath(obj: Record<PropertyKey, any>, path: string, value: any): void;
export declare function normalizeToJson(str: string): string;
export declare function boolean2String(str: string): string | boolean;
export declare function createDOMTemplate(template: string): Element;
export declare const isNonObserver: (name: string, modifier: string) => boolean;
export declare function isDeferred(key: string): key is "if" | "for";
export declare function node2Fragment(el: Element): DocumentFragment;
export declare function isReserved(str: string): boolean;

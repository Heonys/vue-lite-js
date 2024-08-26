import { Vuelite } from "../core/viewmodel/vuelite";
export declare function extractPath(obj: Record<PropertyKey, any>, path: string): any;
export declare function assignPath(obj: Record<PropertyKey, any>, path: string, value: any): void;
export declare function normalizeToJson(str: string): string;
export declare function evaluateBoolean(str: string): string | boolean;
export declare function evaluateValue(vm: Vuelite, exp: string): any;
export declare function createDOMTemplate(template: string): Element;

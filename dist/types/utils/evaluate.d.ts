import Vuelite from "@/core/viewmodel/vuelite";
export declare function safeEvaluate(vm: Vuelite, exp: string): any;
export declare function unsafeEvaluate(context: object, expression: string): any;
export declare function evaluateTemplate(vm: Vuelite, exp: string): string;
export declare function evaluateValue(vm: Vuelite, exp: string): any;

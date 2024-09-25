import type { Ref } from "../../types/compositionApi";
export declare function isRef<T>(value: any): value is Ref<T>;
export declare function isProxy<T extends object>(value: T): boolean;

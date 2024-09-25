import type { ComputedInput, Ref } from "../../types/compositionApi";
import type { SetupResult } from "../viewmodel/option";
import Vuelite from "../viewmodel/vuelite";
export declare function ref<T>(value: T): Ref<T>;
export declare function reactive<T extends object>(target: T): T;
export declare function injectReactivity(vm: Vuelite, refs: SetupResult): void;
export declare function computed<T>(input: ComputedInput<T>): Ref<T>;

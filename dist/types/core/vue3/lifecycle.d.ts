import type { StopHandle } from "../../types/compositionApi";
import Vuelite from "../viewmodel/vuelite";
export declare function onBeforeMount(callback: StopHandle): void;
export declare function onMounted(callback: StopHandle): void;
export declare function onBeforeUpdate(callback: StopHandle): void;
export declare function onUpdated(callback: StopHandle): void;
export declare function bindHooks(vm: Vuelite): void;

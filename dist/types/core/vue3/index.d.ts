import { AppInstance } from "@/types/compositionApi";
import type { CompositionAPIOptions } from "../viewmodel/option";
import { ref, reactive, computed } from "./reactive";
import { watch } from "./watch";
export declare function createApp(options: CompositionAPIOptions): AppInstance;
export * from "./util";
export * from "./lifecycle";
export { ref, reactive, computed, watch };

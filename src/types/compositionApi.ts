import type { Options } from "@/core/viewmodel/option";

export type CompositionAPIOptions = Omit<Options, "el" | "template"> & {
  setup?: (props: any) => SetupResult | void;
};

export interface Ref<T = any> {
  value: T;
}

export type SetupResult = {
  [key: string]: Ref | Function;
};

import type { Options } from "@/core/viewmodel/option";

export type CompositionAPIOptions = Omit<Options, "el" | "template"> & {
  setup?: (props: any) => SetupResult | void;
};

export interface Ref<T = any> {
  value: T;
}

export type UnwrapRef<T> = T extends Ref<infer U> ? U : T;

export type UnwrapNestedRefs<T extends object = {}> = {
  [K in keyof T]: T[K] extends Ref<infer U>
    ? U
    : T[K] extends object
      ? UnwrapNestedRefs<T[K]>
      : T[K];
};

export type SetupResult = {
  [key: string]: Ref | UnwrapNestedRefs | Function;
};

import { HookNames } from "@/core/viewmodel/lifecycle";
import type { Options } from "@/core/viewmodel/option";

export type CompositionAPIOptions = Omit<Options, "el" | "template"> & {
  setup?: (props: any) => SetupResult | void;
};

export interface Ref<T = any> {
  value: T;
  __v_exp: string;
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

type ComputedFn<T> = (oldValue: T | undefined) => T;
type ComputedOption<T> = {
  get: (oldValue: T | undefined) => T;
  set: (value: T) => void;
};
export type ComputedInput<T = any> = ComputedFn<T> | ComputedOption<T>;

export type WatchCallback<T = any> = (value: T, oldValue: T) => void;

export type StopHandle = () => void;
// create 관련 훅이 없는 이유는 setup함수가 그 역할을 하기떄문
export type CompositionHookNames = Exclude<HookNames, "beforeCreate" | "created">;

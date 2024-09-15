import { typeOf } from "@/utils/format";
import { HookNames } from "./lifecycle";
import Vuelite from "./vuelite";

type Accessor<Data, Methods, Computed> = {
  get?(this: Vuelite<Data, Methods, Computed>): any;
  set?(this: Vuelite<Data, Methods, Computed>, value: any): void;
};

type ComputedType<Data, Methods, Computed> = {
  [K: string]: Accessor<Data, Methods, Computed> | (() => any);
};

type WatchMethod = (newVal: any, oldVal: any) => void;

export type WatchObject = {
  handler: WatchMethod;
  immediate?: boolean;
};

type WatchType = {
  [K: string]: WatchMethod | WatchObject;
};

export type Options<Data, Methods, Computed> = {
  el: string;
  template?: string;
  data?: () => Data;
  methods?: Methods & ThisType<Data & Methods & Computed>;
  computed?: ComputedType<Data, Methods, Computed> & ThisType<Data & Methods & Computed>;
  watch?: WatchType;
  styles?: {
    [K: string]: any;
  };
} & {
  [Hook in Exclude<HookNames, "beforeCreate">]?: (this: Data & Methods & Computed) => void;
} & {
  beforeCreate?: (this: void) => void;
};

type AccessorForm = { get?(): any; set?(value: any): void };

export function isAccessor(data: Function | AccessorForm): data is AccessorForm {
  if (typeof data !== "function") return true;
  return false;
}

export function isWatchMethod(value: any): value is WatchMethod {
  return typeOf(value) === "function";
}

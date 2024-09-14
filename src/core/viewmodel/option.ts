import { HookNames } from "./lifecycle";
import Vuelite from "./vuelite";

type Accessor<Data, Methods, Computed> = {
  get?(this: Vuelite<Data, Methods, Computed>): any;
  set?(this: Vuelite<Data, Methods, Computed>, value: any): void;
};

type ComputedType<Data, Methods, Computed> = {
  [K: string]: Accessor<Data, Methods, Computed> | (() => any);
};

export type Options<Data, Methods, Computed> = {
  el: string;
  template?: string;
  data?: () => Data;
  methods?: Methods & ThisType<Data & Methods & Computed>;
  computed?: ComputedType<Data, Methods, Computed> & ThisType<Data & Methods & Computed>;
  watch?: {};
  styles?: {
    [K: string]: any;
  };
} & {
  [Hook in Exclude<HookNames, "beforeCreate">]?: (this: Data & Methods & Computed) => void;
} & {
  beforeCreate?: () => void;
};

type AccessorForm = { get?(): any; set?(value: any): void };

export function isAccessor(data: Function | AccessorForm): data is AccessorForm {
  if (typeof data !== "function") return true;
  return false;
}

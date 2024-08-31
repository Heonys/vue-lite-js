import Vuelite from "./vuelite";

type Accessor<Data, Methods, Computed> = {
  get?(this: Vuelite<Data, Methods, Computed>): any;
  set?(this: Vuelite<Data, Methods, Computed>, value: any): void;
};

export interface Options<Data, Methods, Computed> {
  el: string;
  template?: string;
  data?: () => Data;
  methods?: Methods & ThisType<Data & Methods & Computed>;
  computed?: {
    [K in keyof Computed]: Computed[K] extends Accessor<Data, Methods, Computed>
      ? Computed[K]
      : (() => any) & ThisType<Data & Methods & Computed>;
  };
  watch?: {};
  styles?: {
    [K: string]: any;
  };
}

type AccessorForm = { get?(): any; set?(value: any): void };

export function isAccessor(data: Function | AccessorForm): data is AccessorForm {
  if (typeof data !== "function") return true;
  return false;
}

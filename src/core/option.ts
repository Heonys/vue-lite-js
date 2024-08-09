type Accessor<T = any> = {
  get(): T;
  set(value: T): void;
};

export interface Options {
  el: string;
  data?: () => {
    [Key: string]: any;
  };
  methods?: {
    [Key: string]: Function;
  };
  computed?: {
    [Key: string]: Function | Accessor;
  };
  watch?: {};
  styles?: {
    [K: string]: any;
  };
}

export function isAccessor(data: Function | Accessor): data is Accessor {
  if (typeof data !== "function") return true;
  return false;
}

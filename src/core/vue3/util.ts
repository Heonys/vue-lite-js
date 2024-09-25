import type { Ref } from "../../types/compositionApi";
import { isObject, typeOf } from "@/utils/format";

export function isRef<T>(value: any): value is Ref<T> {
  return typeOf(value) === "object" && Object.hasOwn(value, "__v_isRef");
}
export function isProxy<T extends object>(value: T) {
  return isObject(value) && Object.hasOwn(value, "__v_isReactive");
}

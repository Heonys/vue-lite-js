import type { Ref, UnwrapNestedRefs } from "@/types/compositionApi";
import { typeOf } from "@/utils/format";

function toRef() {}
function isProxy() {}

export function isRef<T>(value: any): value is Ref<T> {
  return typeOf(value) === "object" && Object.hasOwn(value, "__v_isRef");
}
export function isReactive<T extends object>(value: any): value is UnwrapNestedRefs<T> {
  return typeOf(value) === "object" && Object.hasOwn(value, "__v_isReactive");
}

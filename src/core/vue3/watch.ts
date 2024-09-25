import { Ref, WatchCallback } from "../../types/compositionApi";
import Vuelite from "../viewmodel/vuelite";
import { Observer } from "../reactive/observer";
import { ref } from "./reactive";

const watchMap = new WeakMap<Ref, WatchCallback>();
const wachers = new Set<Ref>();

export function watch<T>(source: Ref<T>, callback: WatchCallback<T>) {
  wachers.add(source);
  watchMap.set(source, callback);
}

export function createWacher(vm: Vuelite) {
  wachers.forEach((watcher) => {
    new Observer(vm, watcher.__v_exp, watchMap.get(watcher));
  });
}

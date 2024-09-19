import { isDirective } from "@utils/directive";
import Vuelite from "../viewmodel/vuelite";
import { Directive } from "./directive";
import { replaceAlias } from "@/utils/context";

export type ObserverType = "Template" | "Directive" | "Component";

export class Observable {
  constructor(
    public vm: Vuelite,
    public node: Node,
    type: ObserverType,
    public loopEffects?: Function[],
  ) {
    switch (type) {
      case "Component":
      case "Directive": {
        this.directiveBind(node as HTMLElement);
        break;
      }
      case "Template": {
        this.templateBind(node);
        break;
      }
    }
  }
  directiveBind(el: Element) {
    Array.from(el.attributes).forEach(({ name, value }) => {
      if (isDirective(name)) {
        const global = Vuelite.context;
        value = replaceAlias(global, value);
        new Directive(name, this.vm, el, value, this.loopEffects);
      }
    });
  }
  templateBind(node: Node) {
    let exp = node.textContent;
    const global = Vuelite.context;
    exp = replaceAlias(global, exp);
    new Directive("v-text", this.vm, node, exp);
  }
}

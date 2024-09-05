import { shouldSkipChildren } from "@/utils/directive";

export interface Visitor<T = any> {
  visit(action: Function, target: T): void;
}

export class DomVisitor implements Visitor<HTMLElement> {
  visit(action: (param: HTMLElement) => void, target: HTMLElement) {
    let current: HTMLElement;
    const stack: HTMLElement[] = [target.firstElementChild as HTMLElement];
    while ((current = stack.pop())) {
      action(current);
      if (current.firstElementChild) stack.push(current.firstElementChild as HTMLElement);
      if (current.nextElementSibling) stack.push(current.nextElementSibling as HTMLElement);
    }
  }
}

export class NodeVisitor implements Visitor {
  visit(action: (param: Node) => void, target: HTMLElement): void {
    let current: Node;
    const stack: Node[] = [target.firstChild];

    while ((current = stack.pop())) {
      if (current) {
        if (shouldSkipChildren(current)) {
          action(current);
          if (current.nextSibling) stack.push(current.nextSibling);
          continue;
        }
        action(current);
        if (current.firstChild) stack.push(current.firstChild);
        if (current.nextSibling) stack.push(current.nextSibling);
      }
    }
  }
}

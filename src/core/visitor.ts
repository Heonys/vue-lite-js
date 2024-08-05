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

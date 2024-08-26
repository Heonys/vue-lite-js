export interface Visitor<T = any> {
    visit(action: Function, target: T): void;
}
export declare class DomVisitor implements Visitor<HTMLElement> {
    visit(action: (param: HTMLElement) => void, target: HTMLElement): void;
}
export declare class NodeVisitor implements Visitor {
    visit(action: (param: Node) => void, target: HTMLElement): void;
}

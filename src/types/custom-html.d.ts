declare global {
  interface HTMLElement {
    isComponent?: boolean;
  }
  interface Object {
    _length(): number;
  }
}

export {};

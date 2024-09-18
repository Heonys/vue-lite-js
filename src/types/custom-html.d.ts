declare global {
  interface HTMLElement {
    isComponent?: boolean;
    uid: number;
  }
  interface Object {
    _length(): number;
  }
}

export {};

declare global {
  interface HTMLElement {
    uid: number;
  }
  interface Object {
    _length(): number;
  }
}

export {};

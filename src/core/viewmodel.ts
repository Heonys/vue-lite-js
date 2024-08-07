export class ViewModelInfo {
  constructor(
    public subkey: string,
    public category: string,
    public key: string,
    public value: any,
  ) {
    this.subkey = subkey;
    this.category = category;
    this.key = key;
    this.value = value;
    Object.freeze(this);
  }
}

export abstract class ViewModelListener {
  abstract viewmodelUpdated(viewmodel: ViewModel, updated: Set<ViewModelInfo>): void;
}

class ViewModelSubject extends ViewModelListener {
  static subjects = new Set<ViewModelSubject>();
  static inited = false;
  private info = new Set<ViewModelInfo>();
  private listeners = new Set<ViewModelListener>();

  private static watch(vm: ViewModelSubject) {
    this.subjects.add(vm);
    if (!this.inited) {
      this.inited = true;
      this.notify();
    }
  }
  private static unwatch(vm: ViewModelSubject) {
    this.subjects.delete(vm);
    if (!this.subjects.size) this.inited = false;
  }

  private static notify() {
    const frame = () => {
      this.subjects.forEach((subject) => {
        if (subject.info.size) {
          subject.notify();
          subject.clearInfo();
        }
      });
      if (this.inited) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  addInfo(v: ViewModelInfo) {
    this.info.add(v);
  }
  clearInfo() {
    this.info.clear();
  }

  addListener(v: ViewModelListener) {
    this.listeners.add(v);
    ViewModelSubject.watch(this);
  }
  removeListener(v: ViewModelListener) {
    this.listeners.delete(v);
    if (!this.listeners.size) ViewModelSubject.unwatch(this);
  }
  notify() {
    this.listeners.forEach((v) => {
      v.viewmodelUpdated(this.notifyTarget, this.info);
    });
  }

  get notifyTarget(): ViewModel {
    throw "use override";
  }

  viewmodelUpdated(viewmodel: ViewModel, updated: Set<ViewModelInfo>) {
    updated.forEach((v) => this.addInfo(v));
  }
}

export class ViewModel extends ViewModelSubject {
  static UID: number = 0;
  static UIDToViewModel: Record<number, HTMLElement> = {};
  private static checker = Symbol();
  static PATH = Symbol();

  [CustomKey: PropertyKey]: any;
  el: HTMLElement;
  template: { name: string; data: ViewModel[] };
  private subkey: string = "";
  private _parent: ViewModel | null = null;
  uid: number = 0;

  static get(data: object) {
    return new this(this.checker, data);
  }

  get parent() {
    return this._parent;
  }

  set parent(parent: ViewModel) {
    this._parent = parent;
  }

  get notifyTarget() {
    return this;
  }

  private defineParent(parent: ViewModel, subkey: string) {
    this.parent = parent;
    this.subkey = subkey;
    this.addListener(parent);
  }
  define(target: ViewModel, key: string, value: any) {
    if (value && typeof value === "object" && !(value instanceof ViewModel)) {
      if (Array.isArray(value)) {
        target[key] = [];
        target[key][ViewModel.PATH] = target[ViewModel.PATH] + "." + key;
        value.forEach((v, i) => this.define(target[key], `${i}`, v));
      } else {
        target[key] = {
          [ViewModel.PATH]: target[ViewModel.PATH] + "." + key,
        };
        Object.entries(value).forEach(([k, v]) => {
          this.define(target[key], k, v);
        });
      }

      Object.defineProperty(target[key], "subkey", {
        get: () => target.subkey,
      });
    } else {
      if (value instanceof ViewModel) value.defineParent(this, key);
      Object.defineProperty(target, key, {
        enumerable: true,
        get: () => value,
        set: (newValue) => {
          value = newValue;
          this.addInfo(new ViewModelInfo(target.subkey, target[ViewModel.PATH], key, value));
        },
      });
    }
  }

  constructor(checker: symbol, data: object) {
    super();
    if (checker !== ViewModel.checker) throw "use ViewModel.get()";
    this[ViewModel.PATH] = "root";
    Object.entries(data).forEach(([k, v]) => this.define(this, k, v));
    Object.seal(this);
  }
}

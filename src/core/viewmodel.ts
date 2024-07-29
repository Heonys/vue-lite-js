interface Styles {}
interface Attribute {}
interface Properties {}
interface Events {}

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
  private static checker = Symbol();

  styles: Styles = {};
  attribute: Attribute = {};
  properties: Properties = {};
  events: Events = {};
  [CustomKey: string]: any;
  private subkey: string = "";
  private _parent: ViewModel | null = null;

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

  private defineRelation(parent: ViewModel, subkey: string) {
    this.parent = parent;
    this.subkey = subkey;
    this.addListener(parent);
  }

  constructor(checker: symbol, data: object) {
    super();
    if (checker !== ViewModel.checker) throw "use ViewModel.get()";

    Object.entries(data).forEach(([cat, catValue]) => {
      if (["styles", "attribute", "properties", "events"].includes(cat)) {
        this[cat] = Object.defineProperties(
          catValue,
          Object.entries(catValue).reduce((acc, [key, value]) => {
            acc[key] = {
              enumerable: true,
              get: () => value,
              set: (newValue) => {
                value = newValue;
                this.addInfo(new ViewModelInfo(this.subkey, cat, key, value));
              },
            };
            return acc;
          }, {} as PropertyDescriptorMap),
        );
      } else {
        Object.defineProperty(this, cat, {
          enumerable: true,
          get: () => catValue,
          set: (newValue) => {
            catValue = newValue;
            this.addInfo(new ViewModelInfo(this.subkey, "", cat, catValue));
          },
        });
        if (catValue instanceof ViewModel) {
          catValue.defineRelation(this, cat);
        }
      }
    });
    Object.seal(this);
  }
}

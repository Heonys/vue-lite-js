interface Styles {}
interface Attribute {}
interface Properties {}
interface Events {}

export abstract class ViewModelListener {
  abstract viewmodelUpdated(updated: Set<ViewModelInfo>): void;
}

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

export class ViewModel extends ViewModelListener {
  static subjects = new Set<ViewModel>();
  static inited = false;
  private static checker = Symbol();

  styles: Styles = {};
  attribute: Attribute = {};
  properties: Properties = {};
  events: Events = {};
  [CustomKey: string]: any;
  private isUpdated = new Set<ViewModelInfo>();
  private listeners = new Set<ViewModelListener>();
  subkey: string = "";
  parent: ViewModel | null = null;

  static get(data: object) {
    return new this(this.checker, data);
  }
  static notify(viewmodel: ViewModel) {
    this.subjects.add(viewmodel);
    if (this.inited) return;
    this.inited = true;
    const frame = () => {
      this.subjects.forEach((vm) => {
        if (vm.isUpdated.size) {
          vm.notify();
          vm.isUpdated.clear();
        }
        requestAnimationFrame(frame);
      });
      requestAnimationFrame(frame);
    };
  }

  addListener(v: ViewModelListener) {
    this.listeners.add(v);
  }
  removeListener(v: ViewModelListener) {
    this.listeners.delete(v);
  }
  notify() {
    this.listeners.forEach((v) => v.viewmodelUpdated(this.isUpdated));
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
                this.isUpdated.add(new ViewModelInfo(this.subkey, cat, key, value));
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
            this.isUpdated.add(new ViewModelInfo(this.subkey, "", cat, catValue));
          },
        });
        if (catValue instanceof ViewModel) {
          catValue.parent = this;
          catValue.subkey = cat;
          catValue.addListener(this);
        }
      }
    });
    ViewModel.notify(this);
    Object.seal(this);
  }

  viewmodelUpdated(updated: Set<ViewModelInfo>) {
    updated.forEach((v) => this.isUpdated.add(v));
  }
}

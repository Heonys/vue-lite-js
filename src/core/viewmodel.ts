interface Styles {}
interface Attribute {}
interface Properties {}
interface Events {}

export default class ViewModel {
  private static checker = Symbol();

  styles: Styles = {};
  attribute: Attribute = {};
  properties: Properties = {};
  events: Events = {};
  [CustomKey: string]: any;

  static get(data: object) {
    return new this(this.checker, data);
  }

  constructor(checker: symbol, data: object) {
    if (checker !== ViewModel.checker) throw "use ViewModel.get()";

    Object.entries(data).forEach(([k, v]) => {
      switch (k) {
        case "styles":
          this.styles = v;
          break;
        case "attribute":
          this.attribute = v;
          break;
        case "properties":
          this.properties = v;
          break;
        case "events":
          this.events = v;
          break;
        default:
          this[k] = v;
      }
    });
    Object.seal(this);
  }
}

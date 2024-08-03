import { Binder, ViewModel } from "../core/index";

declare global {
  interface HTMLElement {
    binders?: [Binder, ViewModel];
    binder?: [Binder, ViewModel];
  }
}

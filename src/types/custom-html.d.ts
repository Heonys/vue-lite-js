import { Binder, ViewModel } from "../core/index";

declare global {
  interface HTMLElement {
    binder?: [Binder, ViewModel];
  }
}

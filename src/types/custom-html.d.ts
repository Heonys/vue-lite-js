import { Binder, ViewModel } from "../core/index";

declare global {
  interface HTMLElement {
    bind: string;
  }
}

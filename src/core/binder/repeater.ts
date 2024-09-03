import Vuelite from "../viewmodel/vuelite";

class Repeater {
  constructor(
    public vm: Vuelite,
    public el: HTMLElement,
    public exp: any,
  ) {}
}

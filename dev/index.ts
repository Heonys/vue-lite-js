import { Scanner } from "../src/core/scanner";
import ViewModel from "../src/core/viewmodel";

const viewmodel = ViewModel.get({
  wrapper: ViewModel.get({
    styles: {
      width: "50%",
      background: "#ffa",
      cursor: "pointer",
    },
  }),
  title: ViewModel.get({
    properties: {
      innerHTML: "Title",
    },
  }),
  contents: ViewModel.get({
    properties: {
      innerHTML: "Contents",
    },
  }),
});

const scanner = new Scanner();
const binder = scanner.scan(document.querySelector("#target")!);
binder.render(viewmodel);

import tsPlugin from "@rollup/plugin-typescript";
import terser from "@rollup/plugin-terser";
import alias from "@rollup/plugin-alias";
const { resolve } = require("./utils");

export default [
  {
    input: "src/core/viewmodel/vuelite.ts",
    plugins: [
      tsPlugin(),
      alias({
        entries: [
          { find: "@", replacement: resolve("src") },
          { find: "@utils", replacement: resolve("src/utils") },
        ],
      }),
    ],
    output: [
      {
        file: "dist/bundle.esm.js",
        format: "esm",
      },
      {
        file: "dist/bundle.common.js",
        format: "cjs",
      },
      {
        file: "dist/bundle.js",
        name: "Vuelite",
        format: "umd",
      },
    ],
  },
  {
    input: "src/core/viewmodel/vuelite.ts",
    plugins: [
      tsPlugin(),
      terser(),
      alias({
        entries: [
          { find: "@", replacement: resolve("src") },
          { find: "@utils", replacement: resolve("src/utils") },
        ],
      }),
    ],
    output: [
      {
        file: "dist/bundle.min.js",
        name: "Vuelite",
        format: "esm",
      },
    ],
  },
];

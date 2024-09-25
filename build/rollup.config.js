const tsPlugin = require("@rollup/plugin-typescript");
const terser = require("@rollup/plugin-terser");
const { dts } = require("rollup-plugin-dts");
const del = require("rollup-plugin-delete");

module.exports = [
  {
    input: "src/index.ts",
    plugins: [del({ targets: "dist/*" }), tsPlugin()],
    output: [
      {
        file: "dist/bundle.esm.js",
        format: "esm",
        exports: "named",
      },
      {
        file: "dist/bundle.common.js",
        format: "cjs",
        exports: "named",
      },
      {
        file: "dist/bundle.js",
        name: "Vuelite",
        format: "umd",
        exports: "named",
      },
    ],
  },
  {
    input: "src/index.ts",
    plugins: [tsPlugin(), terser()],
    output: [
      {
        file: "dist/bundle.min.js",
        name: "Vuelite",
        format: "umd",
        exports: "named",
      },
    ],
  },
  {
    input: "./dist/types/index.d.ts",
    plugins: [dts()],
    output: [{ file: "dist/index.d.ts", format: "esm" }],
  },
  {
    input: "./dist/types/index.d.ts",
    plugins: [dts()],
    output: [{ file: "dist/index.d.cts", format: "cjs" }],
  },
];

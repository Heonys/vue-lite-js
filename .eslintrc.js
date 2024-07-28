module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "eslint-config-prettier"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      plugins: ["@typescript-eslint"],
      // extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
    },
  ],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["prettier"],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "prettier/prettier": "error",
    "@typescript-eslint/no-namespace": "off",
    "no-unused-vars": "off",
  },
};

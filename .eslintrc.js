const { defineConfig } = require("eslint-define-config");

module.exports = defineConfig({
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "./.eslintrc-auto-import.json",
    "prettier",
  ],
  // 支持ts的最新语法
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  // @typescript-eslint插件，增强eslint的能力
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    // js/ts
    camelcase: ["error", { properties: "never" }],
    "no-console": ["warn", { allow: ["error", "log", "warn"] }],
    "no-debugger": "warn",
    "no-constant-condition": ["error", { checkLoops: false }],
    "no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
    "no-return-await": "error",
    "no-var": "error",
    "no-empty": ["error", { allowEmptyCatch: true }],
    "prefer-const": [
      "warn",
      { destructuring: "all", ignoreReadBeforeAssign: true },
    ],
    "prefer-arrow-callback": [
      "error",
      { allowNamedFunctions: false, allowUnboundThis: true },
    ],
    "object-shorthand": [
      "error",
      "always",
      { ignoreConstructors: false, avoidQuotes: true },
    ],
    "prefer-rest-params": "error",
    "prefer-spread": "error",
    "prefer-template": "error",

    "no-redeclare": "off",
    "@typescript-eslint/no-redeclare": "error",
    // best-practice
    "array-callback-return": "error",
    "block-scoped-var": "error",
    "no-alert": "warn",
    "no-case-declarations": "error",
    "no-multi-str": "error",
    "no-with": "error",
    "no-void": "error",
    // 'sort-imports': [
    //   'warn',
    //   {
    //     ignoreCase: false,
    //     ignoreDeclarationSort: true,
    //     ignoreMemberSort: false,
    //     memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
    //     allowSeparatedGroups: false,
    //   },
    // ],

    // stylistic-issues
    "prefer-exponentiation-operator": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-non-null-asserted-optional-chain": "off",
    // '@typescript-eslint/consistent-type-imports': [
    //   'error',
    //   { disallowTypeAnnotations: false },
    // ],
    "@typescript-eslint/no-var-requires": "off",
    // prettier
    "prettier/prettier": "off",
    // import
    // 'import/first': 'error',
    // 'import/no-duplicates': 'error',
    // 'import/no-unresolved': 'off',
    // 'import/namespace': 'off',
    // 'import/default': 'off',
    "import/no-named-as-default": "off",
    "import/no-named-as-default-member": "off",
    "import/named": "off",
    "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
  },
});

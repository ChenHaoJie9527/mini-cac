/// <reference types="vitest" />
import { defineConfig, configDefaults } from "vitest/config";
import AutoComponentImport from "unplugin-auto-import/vite";
import viteEslint from "vite-plugin-eslint";
import path from "path";
export default defineConfig({
  test: {
    includeSource: ['src/**'],
  },
  plugins: [
    AutoComponentImport({
      imports: [
        "vitest",
        // {
        //   "[package_name]": ["[importNames]", ["[from]", "[alias]"]],
        // },
      ],
      dts: "./auto-import.d.ts",
      eslintrc: {
        enabled: true,
        filepath: "./.eslintrc-auto-import.json",
        globalsPropValue: true,
      },
    }),
    // viteEslint(),
  ],
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
  },
  resolve: {
    extensions: [".js", ".jsx", ".tsx", ".vue", ".ts"],
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});

/// <reference types="vitest" />
import { defineConfig } from 'vitest/config';
import AutoComponentImport from 'unplugin-auto-import/vite';
import Vue from '@vitejs/plugin-vue';
import path from 'path';
export default defineConfig({
  test: {
    includeSource: ['src/**'],
    environment: 'jsdom',
    coverage: {
      reporter: 'none',
    },
  },
  plugins: [
    Vue(),
    AutoComponentImport({
      imports: ['vitest'],
      dts: './auto-import.d.ts',
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    // viteEslint(),
  ],
  esbuild: {
    jsxFactory: 'h',
    jsxFragment: 'Fragment',
  },
  resolve: {
    extensions: ['.js', '.jsx', '.tsx', '.vue', '.ts'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});

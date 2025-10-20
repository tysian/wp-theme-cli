import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts'],
  format: 'esm',
  sourcemap: false,
  clean: true,
  minify: !options.watch,
  dts: true,
  splitting: false,
}));

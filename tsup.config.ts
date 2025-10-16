import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/bin/wp-theme-cli.ts'],
  format: 'esm',
  sourcemap: false,
  clean: true,
  minify: !options.watch,
}));

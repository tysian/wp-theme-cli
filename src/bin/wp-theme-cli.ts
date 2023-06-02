#!/usr/bin/env node

import { bootstrap } from '../bootstrap.js';

try {
  bootstrap();
} catch (err) {
  if (err instanceof Error) {
    console.error('[wp-theme-cli]', err?.message);
  }
  process.exit(1);
}

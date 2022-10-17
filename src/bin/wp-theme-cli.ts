#!/usr/bin/env node

import('../bootstrap.js')
  .then(({ bootstrap }) => bootstrap())
  .catch((err) => {
    console.error(err?.message);
    process.exit(1);
  });

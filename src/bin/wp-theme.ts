#!/usr/bin/env node

import('../bootstrap.js')
  .then(({ bootstrap }) => bootstrap())
  .then(process.exit(0))
  .catch(process.exit(1));

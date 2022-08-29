#!/usr/bin/env node

import { NODE_MINIMUM_VERSION } from '../constants.js';

const currentVersion = process.versions.node;
const currentMajorVersion = parseInt(currentVersion.split('.')[0], 10);

if (currentMajorVersion < NODE_MINIMUM_VERSION) {
  console.error(`Your Node.js version (v${currentVersion}) is not supported.`);
  console.error(`Please use Node.js v${NODE_MINIMUM_VERSION} or higher.`);
  process.exit(1);
}

import('../bootstrap.js').then(({ bootstrap }) => bootstrap());

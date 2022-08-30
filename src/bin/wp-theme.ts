#!/usr/bin/env node

import semver from 'semver';
import pkg from '../../package.json';

const currentVersion = process.versions.node;
const engines = pkg.engines.node;
const isSupported = semver.satisfies(currentVersion, engines);

if (!isSupported) {
  console.error(`Your Node.js version (v${currentVersion}) is not supported.`);
  console.error(`Please use Node.js v${engines} or higher.`);
  process.exit(1);
}

import('../bootstrap.js')
  .then(({ bootstrap }) => bootstrap())
  .then(process.exit(0))
  .catch(process.exit(1));

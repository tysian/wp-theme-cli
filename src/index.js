require('trace');
require('clarify');

const acfGenerator = require('./modules/acf-gen');

async function bootstrap() {
  acfGenerator();
}

module.exports = bootstrap;

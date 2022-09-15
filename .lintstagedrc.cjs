module.exports = {
  'src/**/*.ts': [
    './node_modules/.bin/prettier --write',
    './node_modules/.bin/eslint --cache --fix',
    () => './node_modules/.bin/tsc -p tsconfig.json --noEmit',
  ],
  '*.{json,md}': ['./node_modules/.bin/prettier --write'],
};

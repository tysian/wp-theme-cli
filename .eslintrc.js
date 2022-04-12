module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'node', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'linebreak-style': 'off',
    'func-names': 'off',
    strict: 'off',
    'no-use-before-define': ['error', { functions: false, classes: true, variables: true }],
    'import/no-commonjs': 0,
    'no-underscore-dangle': 0,
    'no-console': 0,
    'no-case-declarations': 0,
    'no-nested-ternary': 0,
  },
};

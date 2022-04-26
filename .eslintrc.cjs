module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'airbnb-base',
    'node',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error'],
    'no-restricted-syntax': 0,
    'no-await-in-loop': 0,
    'linebreak-style': 'off',
    'func-names': 'off',
    strict: 'off',
    'import/no-commonjs': 0,
    'no-underscore-dangle': 0,
    'no-console': 0,
    'no-case-declarations': 0,
    'no-nested-ternary': 0,
    'import/prefer-default-export': 0,
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'guard-for-in': 0,
    'no-continue': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};


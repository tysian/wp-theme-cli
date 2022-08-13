module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaVersion: 12,
    project: './tsconfig.eslint.json',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/no-use-before-define': ['error'],
    'import/no-unresolved': 'error',
    'no-use-before-define': 'off',
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
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
      },
      node: {
        paths: ['src'],
        extensions: ['.js', '.ts'],
      },
    },
  },
};


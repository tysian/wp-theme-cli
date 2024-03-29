module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2022: true,
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
    ecmaVersion: 'latest',
    source: 'module',
    project: './tsconfig.eslint.json',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'import/no-unresolved': 'error',
    // we prefer for..of instead of array methods because async operations
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'import/prefer-default-export': 'off',
    'no-continue': 'off',
    'import/no-extraneous-dependencies': ['error', { packageDir: './' }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        ts: 'never',
      },
    ],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '$/**',
            group: 'internal',
          },
        ],
      },
    ],
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

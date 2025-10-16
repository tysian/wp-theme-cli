import antfu from '@antfu/eslint-config';
import eslintConfigPrettier from 'eslint-config-prettier';

export default antfu(
  {
    typescript: true,
    stylistic: false,
  },
  {
    rules: {
      // 'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      'no-new': 'off',
      // 'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    },
  },
  eslintConfigPrettier
);

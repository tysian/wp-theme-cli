import chalk from 'chalk';
import path from 'path';

export const loggerRelativePath = (file = '') =>
  `(${chalk.green(path.relative(process.cwd(), file))})`;

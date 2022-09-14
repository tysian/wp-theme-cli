import chalk from 'chalk';
import { getRelativePath } from '../fs/getRelativePath.js';

export const loggerRelativePath = (file: string) => `(${chalk.green(getRelativePath(file))})`;

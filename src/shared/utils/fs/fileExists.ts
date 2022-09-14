import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';

export const fileExists = async (filePath: string) => {
  const resolvedPath = path.resolve(filePath);
  return fs
    .stat(resolvedPath)
    .then(() => resolvedPath)
    .catch(() => {
      throw new Error(`${chalk.green.italic(`'${filePath}'`)} does not exist.`);
    });
};

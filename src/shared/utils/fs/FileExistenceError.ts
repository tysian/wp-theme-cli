import chalk from 'chalk';

export class FileExistenceError extends Error {
  constructor(filePath: string) {
    super(`${chalk.green.italic(`'${filePath}'`)} does not exist.`);
    this.name = 'FileExistenceError';
  }
}

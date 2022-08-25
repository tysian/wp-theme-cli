import chalk from 'chalk';

export const loggerPrefix = (fileType: string) => `[${chalk.cyanBright(fileType.toUpperCase())}]`;

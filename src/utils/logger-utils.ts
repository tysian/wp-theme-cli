import chalk from 'chalk';
import path from 'path';

export const loggerPrefix = (fileType: string) => `[${chalk.cyanBright(fileType.toUpperCase())}]`;

export const loggerRelativePath = (file = '') =>
  `(${chalk.green(path.relative(process.cwd(), file))})`;

export const loggerListElements = (elements: string[]) =>
  `(${elements.map((l) => chalk.green(l)).join(', ')})`;

export const loggerMergeMessages = (msgs: string[] = []) => msgs.filter(Boolean).join(' ');

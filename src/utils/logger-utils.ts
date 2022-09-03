import chalk, { ChalkInstance } from 'chalk';
import { getRelativePath } from './getRelativePath.js';

export const loggerPrefix = (fileType: string) => `[${chalk.cyanBright(fileType.toUpperCase())}]`;

export const loggerRelativePath = (file: string) => `(${chalk.green(getRelativePath(file))})`;

type LoggerListOptions = {
  color?: ChalkInstance;
  parentheses?: boolean;
  separator?: string;
};
export const loggerListElements = (elements: string[], options: LoggerListOptions = {}) => {
  const { color = chalk.green, parentheses = true, separator = ', ' } = options;
  const logString = elements.map((l) => color(l)).join(separator);
  return parentheses ? `(${logString})` : logString;
};

export const loggerMergeMessages = (msgs: string[] = [], separator = ' ') =>
  msgs.filter(Boolean).join(separator);

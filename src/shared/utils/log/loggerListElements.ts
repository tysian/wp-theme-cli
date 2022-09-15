import chalk, { ChalkInstance } from 'chalk';

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

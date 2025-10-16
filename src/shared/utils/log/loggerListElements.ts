import type { ChalkInstance } from 'chalk';
import chalk from 'chalk';

interface LoggerListOptions {
  /**
   * @default chalk.green
   */
  color?: ChalkInstance;
  /**
   * @default true
   */
  parentheses?: boolean;
  /**
   * @default ","
   */
  separator?: string;
}
export const loggerListElements = (elements: string[], options: LoggerListOptions = {}) => {
  const { color = chalk.green, parentheses = true, separator = ', ' } = options;
  const logString = elements.map((l) => color(l)).join(separator);
  return parentheses ? `(${logString})` : logString;
};

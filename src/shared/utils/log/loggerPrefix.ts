import type { ChalkInstance } from 'chalk';
import chalk from 'chalk';

interface LoggerPrefixOptions {
  upperCase?: boolean;
  color?: ChalkInstance;
}

export const loggerPrefix = (
  fileType: string,
  { upperCase = true, color = chalk.cyanBright }: LoggerPrefixOptions = {}
) => `[${color(upperCase ? fileType.toUpperCase() : fileType)}]`;

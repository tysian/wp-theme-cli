import chalk, { ChalkInstance } from 'chalk';

type LoggerPrefixOptions = {
  upperCase?: boolean;
  color?: ChalkInstance;
};

export const loggerPrefix = (
  fileType: string,
  { upperCase = true, color = chalk.cyanBright }: LoggerPrefixOptions = {}
) => `[${color(upperCase ? fileType.toUpperCase() : fileType)}]`;

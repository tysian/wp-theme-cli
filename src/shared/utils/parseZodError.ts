import { ZodError } from 'zod';
import chalk from 'chalk';
import { loggerMergeMessages, loggerPrefix } from './index.js';

type ParseZodErrorOptions = {
  title?: string;
  spaces?: number;
  withPropertyNames?: boolean;
};

export const parseZodError = (
  error: ZodError,
  {
    spaces = 0,
    title = `There ${
      error.issues.length > 1 ? 'were an errors' : 'was an error'
    } when parsing schema`,
    withPropertyNames = true,
  }: ParseZodErrorOptions = {}
) => {
  const { issues } = error;
  const renderedSpaces = new Array(spaces).fill(' ').join('');
  let errorString = '';
  if (title) {
    errorString += `${title}\n`;
  }

  errorString += issues
    .map((issue) => {
      const prefixed = withPropertyNames
        ? loggerPrefix(issue.path.join('.'), { upperCase: false, color: chalk.red })
        : '';
      return `${renderedSpaces}${loggerMergeMessages([prefixed, chalk.gray(issue.message)], ' ')}`;
    })
    .join('\n');
  return errorString;
};

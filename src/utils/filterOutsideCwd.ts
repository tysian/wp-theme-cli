import chalk from 'chalk';
import path from 'path';
import { loggerMergeMessages } from './logger-utils.js';
import { logger } from './logger.js';

/**
 * Filter out files outside of cwd to prevent unwanted changes.
 * @param {string[]} files Array of files
 * @param {boolean} allow Determines if files outside of cwd should be allowed or not.
 * @returns {string[]}
 */
export const filterOutsideCwd = (files: string[], allow = false): string[] => {
  const onlyInCwd = files.filter((file) => path.resolve(file).includes(process.cwd()));

  if (onlyInCwd.length === files.length) {
    return files;
  }

  const outsideOfCwdMessage = 'Found files outside of current working directory!';
  const flag = chalk.yellow('--allow-outside-cwd');

  if (allow !== true) {
    logger.warn(
      loggerMergeMessages([outsideOfCwdMessage, `${flag} flag used, everything will be included.`])
    );

    return onlyInCwd;
  }

  logger.warn(
    loggerMergeMessages([
      outsideOfCwdMessage,
      `Removing them from list to prevent unwanted changes. If you know what are you doing, plase use ${flag} flag`,
    ])
  );

  return files;
};

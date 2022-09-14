import chalk from 'chalk';
import { isNumber } from 'lodash-es';
import { loggerMergeMessages, loggerPrefix } from '../../../utils/logger-utils.js';
import { updateLogger } from '../../../utils/logger.js';
import { CleanerConfig, CleanerConfigSchema } from '../cleaner.config.js';

export const checkConfig = async (config: CleanerConfig) => {
  updateLogger.start('Checking config...');

  // Check schema
  const check = CleanerConfigSchema.strict().safeParse(config);
  if (!check.success) {
    const errors = check.error.issues
      .map((issue) =>
        loggerMergeMessages([
          loggerPrefix(issue.code),
          issue.message,
          'in',
          chalk.green(
            issue.path.reduce((str, val) => {
              if (!str) return val;
              if (isNumber(val)) return `${str}[${val.toString()}]`;
              return `${str}.${val}`;
            }, '') as string
          ),
        ])
      )
      .join('\n');
    throw new Error(`Config have some errors: \n${errors}`);
  }

  updateLogger.complete('Config is OK');
  updateLogger.done();
};

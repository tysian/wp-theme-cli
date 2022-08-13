import chalk from 'chalk';
import { performance } from 'perf_hooks';
import { gitCheck } from '../../utils/gitCheck.js';
import { logger, updateLogger } from '../../utils/logger.js';
import { batchFiles } from './operations/batchFiles.js';
import { selectConfig } from './helpers/selectConfig.js';
import { installDependencies } from '../../utils/installDependencies.js';
import { Statistics, StatisticsCollection } from '../../utils/Statistics.js';

export const cleaner = async (): Promise<void> => {
  logger.none('WordPress template cleaner!');

  try {
    // Check if there are any uncommited changes
    await gitCheck();

    const finalConfig = await selectConfig();

    const stat = new Statistics({
      unchanged: {
        value: 0,
        description: `Files unchanged`,
      },
      modified: {
        value: 0,
        description: `Files removed`,
      },
      removed: {
        value: 0,
        description: `Files modified`,
      },
      errors: {
        value: 0,
        description: `Errors`,
        color: chalk.red,
      },
    });

    stat.startTimer();
    for await (const fileElement of finalConfig) {
      const { file, operationType, options = {} } = fileElement;

      // TODO: Use Promise.all() here?
      const handler = await batchFiles(file, operationType, options);
    }

    stat.stopTimer();
    logger.none(stat.getFormattedStats());

    await installDependencies();
  } catch (error) {
    updateLogger.error((error as Error)?.message);
    updateLogger.done();
  }
};

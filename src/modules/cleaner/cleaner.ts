import chalk from 'chalk';
import { performance } from 'perf_hooks';
import { gitCheck } from '../../utils/gitCheck.js';
import { logger, updateLogger } from '../../utils/logger.js';
import { batchFiles } from './operations/batchFiles.js';
import { selectConfig } from './helpers/selectConfig.js';
import { installDependencies } from '../../utils/installDependencies.js';

export const cleaner = async (): Promise<void> => {
  logger.none('WordPress template cleaner!');

  try {
    // Check if there are any uncommited changes
    await gitCheck();

    const finalConfig = await selectConfig();

    const statistics = {
      unchanged: 0,
      modified: 0,
      removed: 0,
      errors: 0,
    };

    const updateStats = (success, type = 'errors') => {
      if (typeof success === 'object') {
        Object.keys(success).forEach((k) => {
          statistics[k] += success[k];
        });
      } else if (success) statistics[type] += 1;
      else if (success === null) statistics.unchanged += 1;
      else statistics.errors += 1;
    };

    const timeStart = performance.now();
    for await (const fileElement of finalConfig) {
      const { file, operationType, options = {} } = fileElement;

      // TODO: Use Promise.all() here?
      const handler = await batchFiles(file, operationType, options);
      updateStats(handler);
    }

    const timeEnd = performance.now();
    console.log(
      [
        chalk.bold('\nOperation finished.'),
        `Files unchanged: ${chalk.blue(statistics.unchanged)}`,
        `Files removed: ${chalk.blue(statistics.removed)}`,
        `Files modified: ${chalk.blue(statistics.modified)}`,
        `Errors: ${chalk.red(statistics.errors)}`,
        `Time elapsed: ${chalk.blue(`${(timeEnd - timeStart).toFixed(3)}ms`)}`,
      ]
        .filter((m) => String(m).length)
        .join('\n')
    );

    await installDependencies();
  } catch (error) {
    updateLogger.error((error as Error)?.message);
    updateLogger.done();
  }
};

import { gitCheck } from '../../utils/gitCheck.js';
import { logger, updateLogger } from '../../utils/logger.js';
import { selectConfig } from './helpers/selectConfig.js';
import { installDependencies } from '../../utils/installDependencies.js';
import { Statistics } from '../../utils/Statistics.js';
import { handleOperations } from './helpers/handleOperations.js';
import type { Operation } from './cleaner.config.js';
import { filterOperations } from './helpers/filterOperations.js';
import { CleanerStatistics, cleanerStats } from './cleaner.const.js';

export const cleaner = async (): Promise<void> => {
  logger.none('WordPress template cleaner!');

  try {
    // Check if there are any uncommited changes
    // await gitCheck();

    const finalConfig = await selectConfig();
    console.log(finalConfig);
    // const filteredOperations: Operation[] = await filterOperations(finalConfig);

    // const statistics = new Statistics(cleanerStats) as CleanerStatistics;

    // statistics.startTimer();
    // await handleOperations(filteredOperations, statistics);

    // statistics.stopTimer();
    // logger.none(statistics.getFormattedStats());

    // await installDependencies();
  } catch (error) {
    updateLogger.error((error as Error)?.message);
    updateLogger.done();
  }
};

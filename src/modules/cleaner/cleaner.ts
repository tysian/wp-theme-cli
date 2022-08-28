import { gitCheck } from '../../utils/gitCheck.js';
import { logger } from '../../utils/logger.js';
import { selectConfig } from './helpers/selectConfig.js';
import { installDependencies } from '../../utils/installDependencies.js';
import { Statistics } from '../../utils/Statistics.js';
import { handleOperations } from './helpers/handleOperations.js';
import { Operation } from './cleaner.config.js';
import { filterOperations } from './helpers/filterOperations.js';
import { CleanerStatistics, cleanerStats } from './cleaner.const.js';
import { checkConfig } from './helpers/checkConfig.js';
import { handleError } from '../../utils/handleError.js';

export const cleaner = async (): Promise<void> => {
  logger.none('WordPress template cleaner!');

  try {
    // Check if there are any uncommited changes
    await gitCheck();

    const finalConfig = await selectConfig();
    await checkConfig(finalConfig);
    const filteredOperations: Operation[] = await filterOperations(finalConfig);

    const statistics = new Statistics(cleanerStats) as CleanerStatistics;
    statistics.startTimer();
    await handleOperations(filteredOperations, statistics);
    statistics.stopTimer();
    logger.none(statistics.getFormattedStats());

    await installDependencies();
  } catch (error) {
    handleError(error as Error);
  }
};

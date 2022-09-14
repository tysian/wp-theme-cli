import { gitCheck } from '../../utils/gitCheck.js';
import { logger } from '../../utils/logger.js';
import { installDependencies } from '../../utils/installDependencies.js';
import { Statistics } from '../../utils/Statistics.js';
import { handleOperations } from './helpers/handleOperations.js';
import { CleanerConfig, Operation } from './cleaner.config.js';
import { filterOperations } from './helpers/filterOperations.js';
import { CleanerStatistics, cleanerStats, DEFAULT_CONFIG_PATH } from './cleaner.const.js';
import { checkConfig } from './helpers/checkConfig.js';
import { handleError } from '../../utils/handleError.js';
import { askForContinue } from '../../utils/askForContinue.js';
import { selectConfig } from '../../utils/selectConfig.js';
import { createNewConfig } from './helpers/createNewConfig.js';

export const cleaner = async () => {
  logger.none('WordPress template cleaner!');

  try {
    await gitCheck();

    const finalConfig = await selectConfig<CleanerConfig>({
      defaultConfigPath: DEFAULT_CONFIG_PATH,
      createNewConfig,
    });
    await checkConfig(finalConfig);

    if (!(await askForContinue())) return;

    const filteredOperations = await filterOperations(finalConfig);

    const statistics: CleanerStatistics = new Statistics(cleanerStats);
    statistics.startTimer();
    await handleOperations(filteredOperations, statistics);
    statistics.stopTimer();
    logger.none(statistics.getFormattedStats());

    await installDependencies();
  } catch (error) {
    handleError(error as Error);
  }
};

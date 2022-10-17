import { gitCheck } from '$/shared/utils/gitCheck.js';
import { handleError } from '$/shared/utils/handleError.js';
import { logger, selectConfig } from '$/shared/utils/index.js';
import {
  askForInstallDependencies,
  installDependencies,
} from '$/shared/utils/installDependencies.js';
import { Statistics } from '$/shared/utils/Statistics.js';
import { CleanerConfig } from './cleaner.config.js';
import { DEFAULT_CONFIG_PATH, CleanerStatistics, cleanerStats } from './cleaner.const.js';
import { checkConfig } from './helpers/checkConfig.js';
import { createNewConfig } from './helpers/createNewConfig.js';
import { filterOperations } from './helpers/filterOperations.js';
import { handleOperations } from './helpers/handleOperations.js';

export const cleaner = async () => {
  logger.none('WordPress template cleaner!');

  try {
    await gitCheck();

    const finalConfig = await selectConfig<CleanerConfig>({
      defaultConfigPath: DEFAULT_CONFIG_PATH,
      createNewConfig,
    });
    await checkConfig(finalConfig);

    const statistics: CleanerStatistics = new Statistics(cleanerStats);
    const filteredOperations = await filterOperations(finalConfig);
    statistics.startTimer();
    await handleOperations(filteredOperations, statistics);
    statistics.stopTimer();
    logger.none(statistics.getFormattedStats());

    const installDepsPkgManager = await askForInstallDependencies();
    if (installDepsPkgManager) {
      await installDependencies(installDepsPkgManager);
    }
  } catch (error) {
    handleError(error as Error);
  }
};

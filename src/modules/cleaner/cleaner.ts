import type { CleanerConfig } from './cleaner.config.js';
import type { CleanerStatistics } from './cleaner.const.js';
import { logger, selectConfig } from '$/shared/utils/index.js';
import {
  askForInstallDependencies,
  installDependencies,
} from '$/shared/utils/installDependencies.js';
import { Statistics } from '$/shared/utils/Statistics.js';
import { cleanerStats, DEFAULT_CONFIG_PATH } from './cleaner.const.js';
import { checkConfig } from './helpers/checkConfig.js';
import { createNewConfig } from './helpers/createNewConfig.js';
import { filterOperations } from './helpers/filterOperations.js';
import { handleOperations } from './helpers/handleOperations.js';

export const cleaner = async () => {
  logger.none('WordPress template cleaner!');

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
};

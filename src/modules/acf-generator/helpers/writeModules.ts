import type { AcfLayout } from '$/types.js';
import type { AcfGeneratorConfig } from '../acf-generator.config.js';
import type { AcfGeneratorStatistics } from '../acf-generator.const.js';
import { logger, Statistics } from '$/shared/utils/index.js';
import { acfGeneratorStats } from '../acf-generator.const.js';
import { createModule } from './createModule.js';

export const writeModules = async (acfModules: AcfLayout[], config: AcfGeneratorConfig) => {
  logger.none(); // just empty line
  logger.start('Creating files...');

  const statistics: AcfGeneratorStatistics = new Statistics(acfGeneratorStats);
  statistics.startTimer();

  const { fileTypes, conflictAction } = config;
  for await (const layout of acfModules) {
    await createModule({ layout, fileTypes, conflictAction }, statistics);
  }

  statistics.stopTimer();
  logger.complete(`Done!`);

  logger.none();
  logger.none(statistics.getFormattedStats());
};

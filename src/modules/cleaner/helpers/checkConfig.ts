import { updateLogger } from '../../../utils/logger.js';
import { CleanerConfig, CleanerConfigSchema } from '../cleaner.config.js';

export const checkConfig = async (config: CleanerConfig): Promise<void> => {
  updateLogger.start('Checking config');
  CleanerConfigSchema.parse(config);
  updateLogger.complete('Config is OK');
};

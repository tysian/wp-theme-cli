import { CleanerConfig } from '../cleaner.config.js';

export const checkConfig = async (config: CleanerConfig): Promise<boolean> => {
  console.log('checking config (TEMP)', config);
  return true;
};

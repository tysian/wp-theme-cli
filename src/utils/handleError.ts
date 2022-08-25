import { loggerMergeMessages } from './logger-utils.js';
import { updateLogger } from './logger.js';

export const handleError = (error: Error, prefix = '') => {
  updateLogger.error(loggerMergeMessages([prefix, error?.message]));
  updateLogger.done();
};

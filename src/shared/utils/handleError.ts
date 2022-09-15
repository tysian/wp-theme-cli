import { updateLogger } from './log/logger.js';
import { loggerMergeMessages } from './log/loggerMergeMessages.js';

export const handleError = (error: Error, prefix = '') => {
  updateLogger.error(loggerMergeMessages([prefix, error?.message]));
  updateLogger.done();
};

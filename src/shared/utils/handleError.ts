import { updateLogger } from './log/logger.js';
import { loggerMergeMessages } from './log/loggerMergeMessages.js';

export const handleError = (error: unknown | Error, prefix = '') => {
  const message = error instanceof Error ? error.message : 'An error occured';
  updateLogger.error(loggerMergeMessages([prefix, message]));
  updateLogger.done();
};

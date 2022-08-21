import { updateLogger } from './logger.js';

export const handleError = (error: Error) => {
  updateLogger.error(error?.message);
  updateLogger.done();
};

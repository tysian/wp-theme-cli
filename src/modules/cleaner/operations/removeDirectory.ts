import fs from 'fs/promises';
import path from 'path';
import { fileExists } from '../../../utils/fileExist.js';
import { handleError } from '../../../utils/handleError.js';
import {
  loggerRelativePath,
  loggerPrefix,
  loggerMergeMessages,
} from '../../../utils/logger-utils.js';
import { updateLogger } from '../../../utils/logger.js';
import { RemoveDirectoryOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';

export const removeDirectory = async (
  file: string,
  { groupKey = '', description = '' }: RemoveDirectoryOperation,
  statistics: CleanerStatistics
) => {
  const relativePath = loggerRelativePath(file);
  const prefix = groupKey ? loggerPrefix(groupKey) : '';
  const message = description || 'Removed directory';

  try {
    updateLogger.start(loggerMergeMessages([prefix, `Removing directory`, relativePath]));

    const exists = await fileExists(file).catch(() => false);
    if (!exists) {
      updateLogger.skip(loggerMergeMessages([prefix, `Directory not found`, relativePath]));
      updateLogger.done();
      statistics.incrementStat('unchanged');
      return null;
    }

    const fullPath = path.resolve(file);
    await fs.rmdir(fullPath, { recursive: true });
    updateLogger.complete(loggerMergeMessages([prefix, message, relativePath]));
    updateLogger.done();
    statistics.incrementStat('removed');
    return true;
  } catch (error) {
    statistics.incrementStat('error');
    handleError(error as Error, prefix);
    return false;
  }
};

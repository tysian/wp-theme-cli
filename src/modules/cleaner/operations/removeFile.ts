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
import { RemoveFileOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';

export const removeFile = async (
  file: string,
  { groupKey = '', description = '' }: RemoveFileOperation,
  statistics: CleanerStatistics
) => {
  const relativePath = loggerRelativePath(file);
  const prefix = groupKey ? loggerPrefix(groupKey) : '';
  const message = description || 'Removed file';

  try {
    updateLogger.start(loggerMergeMessages([prefix, `Removing file`, relativePath]));

    const exists = await fileExists(file).catch(() => false);
    if (!exists) {
      updateLogger.skip(loggerMergeMessages([prefix, `File not found`, relativePath]));
      updateLogger.done();
      statistics.incrementStat('unchanged');
      return null;
    }

    const fullPath = path.resolve(file);
    await fs.unlink(fullPath);

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

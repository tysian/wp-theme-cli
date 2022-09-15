import fs from 'fs/promises';
import path from 'path';
import { fileExists } from '$/shared/utils/index.js';
import { handleError } from '$/shared/utils/handleError.js';
import { RemoveFileOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { OperationsLogger } from '../helpers/OperationLogger.js';

export const removeFile = async (
  file: string,
  { groupKey = '', description = '' }: RemoveFileOperation,
  statistics: CleanerStatistics
) => {
  const operationLogger = new OperationsLogger({
    relativePath: file,
    prefix: groupKey,
    message: description || 'Removed file',
  });

  try {
    operationLogger.start('Removing file');

    const exists = await fileExists(file);
    if (!exists) {
      operationLogger.skip('File not found');
      statistics.incrementStat('unchanged');
      return null;
    }

    const fullPath = path.resolve(file);
    await fs.unlink(fullPath);

    operationLogger.complete();
    statistics.incrementStat('removed');
    return true;
  } catch (error) {
    statistics.incrementStat('error');
    handleError(error as Error, operationLogger.prefix);
    return false;
  }
};

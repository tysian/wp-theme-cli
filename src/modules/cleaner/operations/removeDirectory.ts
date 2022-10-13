import fs from 'fs/promises';
import path from 'path';
import { isDirectory } from '$/shared/utils/index.js';
import { handleError } from '$/shared/utils/handleError.js';
import { RemoveDirectoryOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { OperationsLogger } from '../helpers/OperationLogger.js';

export const removeDirectory = async (
  file: string,
  { groupKey = '', description = '' }: RemoveDirectoryOperation,
  statistics: CleanerStatistics
) => {
  const operationLogger = new OperationsLogger({
    relativePath: file,
    prefix: groupKey,
    message: description || 'Removed directory',
  });

  try {
    operationLogger.start('Removing directory');

    const checkIsDirectory = await isDirectory(file);
    if (!checkIsDirectory) {
      operationLogger.skip('Directory not found');
      statistics.incrementStat('unchanged');
      return;
    }
    const fullPath = path.resolve(file);
    await fs.rmdir(fullPath, { recursive: true });

    operationLogger.complete();
    statistics.incrementStat('removed');
  } catch (error) {
    statistics.incrementStat('error');
    handleError(error as Error, operationLogger.prefix);
  }
};

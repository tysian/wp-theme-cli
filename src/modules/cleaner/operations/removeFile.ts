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
      statistics.addFile('unchanged', file);
      return;
    }

    const fullPath = path.resolve(file);
    await fs.unlink(fullPath);

    operationLogger.complete();
    statistics.addFile('removed', file);
  } catch (error) {
    statistics.addFile('error', file);
    handleError(error as Error, operationLogger.prefix);
  }
};

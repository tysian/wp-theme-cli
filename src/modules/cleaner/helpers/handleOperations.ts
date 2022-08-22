import chalk from 'chalk';
import { logger } from '../../../utils/logger.js';
import { CleanerStatistics, OperationType } from '../cleaner.const.js';
import { modifyJSON } from '../operations/modifyJSON.js';
import { removeDirectory } from '../operations/removeDirectory.js';
import { removeFile } from '../operations/removeFile.js';
import { removeFileLine } from '../operations/removeFileLine.js';
import { getGlobFiles } from './getGlobFiles.js';
import type { Operation } from '../cleaner.config.js';
import { asArray } from '../../../utils/asArray.js';
import { handleError } from '../../../utils/handleError.js';

export const handleOperations = async (
  operations: Operation[],
  statistics: CleanerStatistics
): Promise<void> => {
  for await (const operation of operations) {
    try {
      const { input, operationType } = operation;
      const files = await getGlobFiles(input);

      const outsideOfCwd = files.filter((file) => !file.includes(process.cwd()));
      if (outsideOfCwd.length > 0) {
        throw new Error('outside of cwd!');
      }

      if (!files.length) {
        logger.warn(
          `Files (${asArray(input)
            .map((inp) => chalk.green(inp))
            .join(',')}) not found for operation ${chalk.blue(operationType)}`
        );

        continue;
      }

      for await (const file of files) {
        try {
          switch (operationType) {
            case OperationType.MODIFY_JSON:
              await modifyJSON(file, operation, statistics);
              break;
            case OperationType.REMOVE_FILE_LINE:
              await removeFileLine(file, operation, statistics);
              break;
            case OperationType.REMOVE_DIRECTORY:
              await removeDirectory(file, statistics);
              break;
            case OperationType.REMOVE_FILE:
              await removeFile(file, statistics);
              break;
            default:
              break;
          }
        } catch (error) {
          handleError(error as Error);
        }
      }
    } catch (error) {
      handleError(error as Error);
    }
  }
};

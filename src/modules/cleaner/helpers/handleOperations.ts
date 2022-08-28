import chalk from 'chalk';
import { logger } from '../../../utils/logger.js';
import { CleanerStatistics, OperationType } from '../cleaner.const.js';
import { removeDirectory } from '../operations/removeDirectory.js';
import { removeFile } from '../operations/removeFile.js';
import { removeFileLine } from '../operations/removeFileLine.js';
import { getGlobFiles } from './getGlobFiles.js';
import { Operation } from '../cleaner.config.js';
import { asArray } from '../../../utils/asArray.js';
import { handleError } from '../../../utils/handleError.js';
import { removeFromJSON } from '../operations/removeFromJSON.js';
import { removeACFLayout } from '../operations/removeACFLayout.js';
import { loggerMergeMessages, loggerPrefix } from '../../../utils/logger-utils.js';

export const handleOperations = async (
  operations: Operation[],
  statistics: CleanerStatistics
): Promise<void> => {
  for await (const operation of operations) {
    try {
      const { input, operationType, description = '', groupKey = '' } = operation;
      const files = await getGlobFiles(input);

      const outsideOfCwd = files.filter((file) => !file.includes(process.cwd()));
      if (outsideOfCwd.length > 0) {
        throw new Error('Operation outside of current working directory!');
      }

      if (!files.length) {
        logger.skip(
          loggerMergeMessages([
            groupKey ? loggerPrefix(groupKey) : '',
            `${asArray(input).length} ${
              operationType === OperationType.REMOVE_DIRECTORY
                ? `director${asArray(input).length > 1 ? 'ies' : 'y'}`
                : `file${asArray(input).length > 1 ? 's' : ''}`
            } not found`,
            `for operation (${chalk.green(description || operationType)})`,
          ])
        );

        continue;
      }

      for await (const file of files) {
        try {
          switch (operationType) {
            case OperationType.REMOVE_FROM_JSON:
              await removeFromJSON(file, operation, statistics);
              break;
            case OperationType.REMOVE_ACF_LAYOUT:
              await removeACFLayout(file, operation, statistics);
              break;
            case OperationType.REMOVE_FILE_LINE:
              await removeFileLine(file, operation, statistics);
              break;
            case OperationType.REMOVE_DIRECTORY:
              await removeDirectory(file, operation, statistics);
              break;
            case OperationType.REMOVE_FILE:
              await removeFile(file, operation, statistics);
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

import chalk from 'chalk';
import { logger, loggerMergeMessages, loggerPrefix } from '$/shared/utils/index.js';
import { asArray } from '$/shared/utils/asArray.js';
import { filterOutsideCwd } from '$/shared/utils/filterOutsideCwd.js';
import { handleError } from '$/shared/utils/handleError.js';
import { Operation } from '../cleaner.config.js';
import { CleanerStatistics, OperationType } from '../cleaner.const.js';
import { removeACFLayout } from '../operations/removeACFLayout.js';
import { removeDirectory } from '../operations/removeDirectory.js';
import { removeFile } from '../operations/removeFile.js';
import { removeFileLine } from '../operations/removeFileLine.js';
import { removeFromJSON } from '../operations/removeFromJSON.js';
import { getGlobFiles } from './getGlobFiles.js';

export const handleOperations = async (operations: Operation[], statistics: CleanerStatistics) => {
  for await (const operation of operations) {
    try {
      const { input, operationType, description = '', groupKey = '' } = operation;

      const files = await getGlobFiles(input).then((output) =>
        filterOutsideCwd(output, global.programOptions?.allowOutsideCwd)
      );

      if (!files.length) {
        logger.skip(
          loggerMergeMessages([
            // key of current group
            groupKey ? loggerPrefix(groupKey) : '',
            // description or operation type
            description || operationType,
            chalk.gray(
              // amount of files
              asArray(input).length,
              // plural or singular
              operationType === OperationType.REMOVE_DIRECTORY
                ? `director${asArray(input).length > 1 ? 'ies' : 'y'}`
                : `file${asArray(input).length > 1 ? 's' : ''}`,
              `not found`
            ),
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

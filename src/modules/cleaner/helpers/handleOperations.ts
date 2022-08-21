import glob from 'fast-glob';
import path from 'path';
import chalk from 'chalk';
import { log, logger } from '../../../utils/logger.js';
import { OperationType } from '../cleaner.const.js';
import { modifyJSON } from '../operations/modifyJSON.js';
import { removeDirectory } from '../operations/removeDirectory.js';
import { removeFile } from '../operations/removeFile.js';
import { removeFileLine } from '../operations/removeFileLine.js';
import { getGlobFiles } from './getGlobFiles.js';
import type { Operation } from '../cleaner.config.js';
import { asArray } from '../../../utils/asArray.js';
import { Statistics } from '../../../utils/Statistics.js';
import type { ValueOf } from '../../../types/ValueOf.js';
import { handleError } from '../../../utils/handleError.js';

const operationsFunctions = {
  modifyJSON,
  removeDirectory,
  removeFile,
  removeFileLine,
};

type AvailableOperations = {
  [key in OperationType]: {
    statType: string;
    fn: ValueOf<typeof operationsFunctions>;
    args: string[];
  };
};

const availableOperations: AvailableOperations = {
  [OperationType.MODIFY_JSON]: { statType: 'modified', fn: modifyJSON, args: ['file', 'callback'] },
  [OperationType.REMOVE_FILE_LINE]: {
    statType: 'modified',
    fn: removeFileLine,
    args: ['file', 'search'],
  },
  [OperationType.REMOVE_DIRECTORY]: { statType: 'removed', fn: removeDirectory, args: ['file'] },
  [OperationType.REMOVE_FILE]: { statType: 'removed', fn: removeFile, args: ['file'] },
};

export const handleOperations = async (
  operations: Operation[],
  statistics: Statistics
): Promise<void> => {
  for await (const operation of operations) {
    try {
      const { input, operationType } = operation;
      const files = await getGlobFiles(input);

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
          let handler = null;
          if (operationType === OperationType.REMOVE_FILE_LINE) {
            handler = await removeFileLine(file, search);
            if (handler) statistics.modified += 1;
          } else if (operationType === OperationType.REMOVE_FILE) {
            handler = await removeFile(file);
            if (handler) statistics.removed += 1;
          } else if (operationType === OperationType.MODIFY_JSON) {
            handler = await modifyJSON(file, options);
            if (handler) statistics.modified += 1;
          } else if (operationType === OperationType.REMOVE_DIRECTORY) {
            handler = await removeDirectory(file);
            if (handler) statistics.removed += 1;
          } else {
            log('Wrong operation type.', 'error');
            handler = false;
          }
          if (handler !== null && !handler) statistics.error += 1;
          else if (!handler && !isSearchGlob) statistics.unchanged += 1;
        } catch (error) {
          handleError(error as Error);
        }
      }
    } catch (error) {
      handleError(error as Error);
    }
  }
};

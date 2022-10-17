import chalk from 'chalk';
import {
  updateLogger,
  loggerMergeMessages,
  loggerPrefix,
  loggerListElements,
  asArray,
} from '$/shared/utils/index.js';
import { CleanerConfig } from '../cleaner.config.js';
import { OperationType } from '../cleaner.const.js';

export const checkConfig = async (config: Partial<CleanerConfig>) => {
  updateLogger.start('Checking config...');

  // groups are not empty
  if (!config?.groups || !Array.isArray(config.groups) || !config.groups.length) {
    throw new Error(`${chalk.green('groups')} property is not an array or it's empty`);
  }
  // each key in group is unique
  const groupsKeys = config.groups.map(({ key = '' }) => key);

  if (groupsKeys.length !== groupsKeys.filter(Boolean).length) {
    throw new Error(`Each group must have an unique ${chalk.green('key')} property`);
  }

  if (groupsKeys.length !== [...new Set(groupsKeys)].length) {
    throw new Error('All group keys must be unique');
  }

  for (const group of config.groups) {
    const groupPrefix = loggerPrefix(group?.name || group.key);

    if (!group?.operations || !Array.isArray(group?.operations) || !group.operations.length) {
      throw new Error(
        loggerMergeMessages([
          groupPrefix,
          `${chalk.green('operations')} property is not an array or it's empty`,
        ])
      );
    }

    for (const [operationIndex, operation] of group.operations.entries()) {
      const operationPrefix = loggerPrefix(`${operationIndex}`);
      const createError = (msg: string) =>
        new Error(loggerMergeMessages([groupPrefix, operationPrefix, msg]));

      // operation have valid operationType
      const operationTypes = Object.keys(OperationType);
      if (!operationTypes.includes(operation.operationType)) {
        throw createError(
          `Wrong operation type (${chalk.red(
            operation.operationType
          )}), accepting only ${loggerListElements(operationTypes, { parentheses: false })}`
        );
      }

      // operation have input property
      if (!operation?.input) {
        throw createError(`Empty ${chalk.green('input')} property`);
      }

      // REMOVE_FILE_LINE have search property which is not empty string/empty array
      if (
        operation.operationType === OperationType.REMOVE_FILE_LINE &&
        (!('search' in operation) || !operation.search.length)
      ) {
        throw createError(`Empty ${chalk.green('search')} property`);
      }

      if (
        operation.operationType === OperationType.REMOVE_FROM_JSON ||
        operation.operationType === OperationType.REMOVE_ACF_LAYOUT
      ) {
        // REMOVE_FROM_JSON have propertyPaths property
        if (
          operation.operationType === OperationType.REMOVE_FROM_JSON &&
          (!('propertyPaths' in operation) ||
            !asArray(operation.propertyPaths).filter(Boolean).length)
        ) {
          throw createError(`Empty ${chalk.green('propertyPaths')} property`);
        }

        // REMOVE_ACF_LAYOUT have layouts property
        if (
          operation.operationType === OperationType.REMOVE_ACF_LAYOUT &&
          (!('layouts' in operation) || !asArray(operation.layouts).filter(Boolean).length)
        ) {
          throw createError(`Empty ${chalk.green('layouts')} property`);
        }

        // Input only contains json files
        const nonJsonEntries = asArray(operation.input).find((inp) => !inp.endsWith('.json'));
        if (nonJsonEntries) {
          throw createError(`Input property contains non-json files`);
        }
      }
    }
  }

  updateLogger.complete('Config is OK');
  updateLogger.done();
};

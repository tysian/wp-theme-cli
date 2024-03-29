import chalk from 'chalk';
import getSlug from 'speakingurl';
import inquirer from 'inquirer';
import { cloneDeep } from 'lodash-es';
import {
  logger,
  loggerMergeMessages,
  loggerPrefix,
  getRelativePath,
  saveConfig,
} from '$/shared/utils/index.js';
import {
  CleanerConfig,
  Operation,
  OperationGroup,
  RemoveACFLayoutOperation,
  RemoveFileLineOperation,
  RemoveFromJSONOperation,
} from '../cleaner.config.js';
import { DEFAULT_CONFIG_FILENAME, OperationType } from '../cleaner.const.js';

const addMultipleEntries = async (entryName = 'entry'): Promise<string[]> => {
  let stop = false;
  const entries = [];

  while (!stop) {
    const { entry } = await inquirer.prompt<{ entry: string }>([
      {
        name: 'entry',
        type: 'input',
        message: `Provide ${chalk.green(entryName)}`,
      },
    ]);
    entries.push(entry);
    if (entries.length > 0) {
      const { shouldContinue } = await inquirer.prompt<{ shouldContinue: boolean }>([
        {
          name: 'shouldContinue',
          type: 'confirm',
          default: false,
          message: `Want to add another ${chalk.green(entryName)}?`,
        },
      ]);

      stop = !shouldContinue;
    }
  }

  return entries;
};

const createNewGroup = async (allGroups: OperationGroup[]): Promise<OperationGroup> => {
  const { name } = await inquirer.prompt<{ name: string }>([
    {
      type: 'input',
      name: 'name',
      message: 'Provide group name',
      validate: (input: string) => !!input.trim().length || 'Name cannot be empty',
    },
  ]);

  const { key } = await inquirer.prompt<{ key: string }>([
    {
      type: 'input',
      name: 'key',
      message: 'Provide an unique key',
      default: getSlug(name),
      transformer: (input) => getSlug(input),
      validate: (input: string) => {
        if (!getSlug(input).trim().length) {
          return 'Key cannot be empty';
        }
        if (allGroups.find((group) => group.key === getSlug(input))) {
          return 'You have to use unique key';
        }
        return true;
      },
    },
  ]);

  logger.info(`New group ${chalk.cyan(name)} created.`);
  return { name, key: getSlug(key), operations: [] };
};

const createNewOperation = async (group?: OperationGroup | null): Promise<Operation> => {
  const messages: { [key in OperationType]: string } = {
    [OperationType.REMOVE_ACF_LAYOUT]: 'Remove ACF layout',
    [OperationType.REMOVE_FROM_JSON]: 'Remove from JSON',
    [OperationType.REMOVE_FILE_LINE]: 'Remove line from file',
    [OperationType.REMOVE_FILE]: 'Remove a file',
    [OperationType.REMOVE_DIRECTORY]: 'Remove a directory',
  };

  const { description, type } = await inquirer.prompt<{
    description: string;
    type: OperationType;
  }>([
    {
      type: 'list',
      name: 'type',
      message: loggerMergeMessages([
        loggerPrefix(group && group?.key ? group.key : ''),
        'Select operation type',
      ]),
      choices: Object.entries(messages).map(([key, message]) => ({
        name: message,
        value: key,
      })),
    },
    {
      type: 'input',
      name: 'description',
      message: 'Provide a description',
    },
  ]);

  const { input } = await inquirer.prompt<{ input: string[] }>([
    {
      type: 'file-tree-selection',
      name: 'input',
      message: `Select files to process`,
      multiple: true,
      onlyShowDir: type === OperationType.REMOVE_DIRECTORY,
      enableGoUpperDirectory: true,
      validate: (inputPath) =>
        !!inputPath ||
        `Select at least one ${type === OperationType.REMOVE_DIRECTORY ? 'directory' : 'file'}`,
    },
  ]);

  const operation: Partial<Operation> = {
    operationType: type,
    description,
    input: input.map((filePath: string) => getRelativePath(filePath)),
  };

  switch (type) {
    case OperationType.REMOVE_ACF_LAYOUT:
      (operation as RemoveACFLayoutOperation).layouts = await addMultipleEntries('layout name');
      break;
    case OperationType.REMOVE_FROM_JSON:
      (operation as RemoveFromJSONOperation).propertyPaths = await addMultipleEntries(
        'property path'
      );
      break;
    case OperationType.REMOVE_FILE_LINE:
      (operation as RemoveFileLineOperation).search = await addMultipleEntries('search value');
      break;
    default:
      break;
  }

  logger.info(`New operation ${chalk.cyan(OperationType[type])} created.`);
  return operation as Operation;
};

export const createNewConfig = async (): Promise<CleanerConfig> => {
  const { name, description } = await inquirer.prompt<{ name: string; description: string }>([
    {
      type: 'input',
      name: 'name',
      message: 'The name of the config',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description of the config',
    },
  ]);

  const groups: OperationGroup[] = [];
  let currentOperation: Operation;
  let currentGroup: OperationGroup = { name: '', key: '', operations: [] };
  let completed = false;
  while (!completed) {
    logger.none(); // just spacer
    const canAddOperation = groups.length === 0 && !currentGroup.key;
    const canAddGroup = currentGroup.key && currentGroup.operations.length === 0;
    const { whatsNext } = await inquirer.prompt<{ whatsNext: string }>([
      {
        name: 'whatsNext',
        type: 'list',
        message: 'What to do next?',
        choices: [
          {
            name: chalk[canAddOperation ? 'gray' : 'reset']('Add new operation'),
            value: 'operation',
            disabled: canAddOperation ? 'Create group first' : false,
          },
          {
            name: chalk[canAddGroup ? 'gray' : 'reset']('Add new group'),
            value: 'group',
            disabled: canAddGroup ? `Current group can't be empty` : false,
          },
          { name: 'Finish', value: 'finish' },
        ],
      },
    ]);

    if (whatsNext === 'group') {
      if (currentGroup.operations.length > 0) {
        groups.push(cloneDeep(currentGroup));
      }
      currentGroup = await createNewGroup(groups);
    }

    if (whatsNext === 'operation') {
      currentOperation = await createNewOperation(currentGroup.key ? currentGroup : null);
      currentGroup.operations.push(currentOperation);
    }

    if (whatsNext === 'finish') {
      groups.push(cloneDeep(currentGroup));
    }
    completed = whatsNext === 'finish';
  }

  const newConfig: CleanerConfig = { name, description, groups };

  await saveConfig<CleanerConfig>(
    name.trim().length ? DEFAULT_CONFIG_FILENAME.replace('default', name) : DEFAULT_CONFIG_FILENAME,
    newConfig
  );

  return newConfig;
};

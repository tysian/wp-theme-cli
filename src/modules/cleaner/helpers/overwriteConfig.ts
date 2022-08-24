import chalk from 'chalk';
import getSlug from 'speakingurl';
import inquirer from 'inquirer';
import { cloneDeep } from 'lodash-es';
import {
  CleanerConfig,
  ModifyJSONAvailableCallbacks,
  ModifyJSONCallback,
  Operation,
  OperationGroup,
} from '../cleaner.config.js';
import { OperationType } from '../cleaner.const.js';
import { logger } from '../../../utils/logger.js';

const addMultipleEntries = async (entryName = 'entry'): Promise<string[]> => {
  let stop = false;
  const entries = [];

  while (!stop) {
    const { entry } = await inquirer.prompt([
      {
        name: 'entry',
        type: 'input',
        message: `Provide ${chalk.green(entryName)}`,
      },
    ]);
    entries.push(entry);
    if (entries.length > 0) {
      const { shouldContinue } = await inquirer.prompt([
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
  const { name } = await inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Provide group name',
      validate: (input: string) => {
        if (!input.trim().length) {
          return 'Name cannot be empty';
        }
        return true;
      },
    },
  ]);

  const { key } = await inquirer.prompt([
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

const createNewOperation = async (): Promise<Operation> => {
  const messages: { [key in OperationType]: string } = {
    [OperationType.MODIFY_JSON]: 'Modify JSON file',
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
      message: 'Select operation type',
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

  const { input } = await inquirer.prompt([
    {
      type: 'file-tree-selection',
      name: 'input',
      message: `Select files to process`,
      multiple: true,
      onlyShowDir: type === OperationType.REMOVE_DIRECTORY,
      default: [],
    },
  ]);

  const operation: any = { operationType: type, description, input };

  if (type === OperationType.MODIFY_JSON) {
    // select callback
    const { functionName } = await inquirer.prompt<{
      functionName: keyof typeof ModifyJSONAvailableCallbacks;
    }>([
      {
        type: 'list',
        name: 'functionName',
        choices: Object.keys(ModifyJSONAvailableCallbacks),
      },
    ]);
    // provide args
    const args = await addMultipleEntries('function argument');
    const callback: ModifyJSONCallback = { functionName, args };
    operation.callback = callback;
  }

  if (type === OperationType.REMOVE_FILE_LINE) {
    const search = await addMultipleEntries('search value');
    operation.search = search;
  }

  logger.info(`New operation ${chalk.cyan(OperationType[type])} created.`);
  return operation;
};

export const overwriteConfig = async (): Promise<CleanerConfig> => {
  const { name, description } = await inquirer.prompt([
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
    const { whatsNext } = await inquirer.prompt([
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
      currentOperation = await createNewOperation();
      currentGroup.operations.push(currentOperation);
    }

    if (whatsNext === 'finish') {
      groups.push(cloneDeep(currentGroup));
    }
    completed = whatsNext === 'finish';
  }

  const newConfig: CleanerConfig = { name, description, groups };

  return newConfig;
};

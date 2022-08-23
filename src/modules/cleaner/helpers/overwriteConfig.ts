import filenamify from 'filenamify';
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

const addMultipleEntries = async (): Promise<string[]> => {
  let stop = false;
  const entries = [];

  while (!stop) {
    const { entry } = await inquirer.prompt([
      {
        name: 'entry',
        type: 'input',
        message: 'Provide an entry',
      },
    ]);
    entries.push(entry);
    if (entries.length > 0) {
      const { shouldContinue } = await inquirer.prompt([
        {
          name: 'shouldContinue',
          type: 'confirm',
          default: false,
          message: 'Want to add another entry?',
        },
      ]);

      stop = !shouldContinue;
    }
  }

  return entries;
};

const createNewGroup = async (allGroups: OperationGroup[]): Promise<OperationGroup> => {
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'key',
      message: 'Provide an unique key',
      validate: (key: string) =>
        allGroups.find((group) => group.key === filenamify(key))
          ? 'You have to use unique key'
          : true,
    },
  ]);

  // TODO: slugify instead
  const key = filenamify(answers.key);

  return { key, operations: [] };
};

const createNewOperation = async (): Promise<Operation> => {
  const messages: { [key in OperationType]: string } = {
    [OperationType.MODIFY_JSON]: 'Modify JSON file',
    [OperationType.REMOVE_FILE_LINE]: 'Remove line from file',
    [OperationType.REMOVE_FILE]: 'Remove a file',
    [OperationType.REMOVE_DIRECTORY]: 'Remove a directory',
  };

  const { description, type, input } = await inquirer.prompt([
    {
      type: 'list',
      name: 'type',
      message: 'Select operation type',
      choices: Object.entries(messages).map(([key, message]) => ({
        name: key,
        value: message,
      })),
    },
    {
      type: 'input',
      name: 'description',
      messages: 'Provide a description',
    },
    {
      type: 'file-tree-selection',
      name: 'input',
      message: `Select files to process`,
      multiple: true,
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
    const args = await addMultipleEntries();
    const callback: ModifyJSONCallback = { functionName, args };
    operation.callback = callback;
  }

  if (type === OperationType.REMOVE_FILE_LINE) {
    const search = await addMultipleEntries();
    operation.search = search;
  }

  return operation;
};

export const overwriteConfig = async (): Promise<CleanerConfig> => {
  const { name, description, chlebek } = await inquirer.prompt([
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
  let currentGroup: OperationGroup = { key: '', operations: [] };
  let completed = false;
  while (!completed) {
    const { whatsNext } = await inquirer.prompt([
      {
        name: 'whatsNext',
        type: 'list',
        message: 'What to do next?',
        choices: [
          { name: 'Add new operation', value: 'operation' },
          { name: 'Add new group', value: 'group' },
          { name: 'Finish', value: 'finish' },
        ],
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        validate: (input: string) => {
          console.log({ input, leng: groups.length });
          if (input === 'operation' && groups.length === 0) {
            return 'You have to create group first';
          }

          if (input === 'group' && currentGroup.operations.length === 0) {
            return `You can't create empty group, add some operations first`;
          }

          return true;
        },
      },
    ]);

    if (whatsNext === 'group') {
      groups.push(cloneDeep(currentGroup));
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

  return { name, description, groups };
};

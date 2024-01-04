import path from 'path';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { SetOptional, SetRequired } from 'type-fest';
import {
  loggerPrefix,
  loggerListElements,
  getRelativePath,
  saveConfig,
} from '$/shared/utils/index.js';
import { AcfGeneratorConfig, AvailableFileType, FileType } from '../acf-generator.config.js';
import { DEFAULT_CONFIG_FILENAME } from '../acf-generator.const.js';

export const createNewConfig = async () => {
  // Ask for ACF JSON file
  const answers = await inquirer.prompt<Omit<AcfGeneratorConfig, 'fileTypes'>>([
    {
      name: 'modulesFilePath',
      type: 'file-tree-selection',
      message: 'Select JSON file with flexible field',
      validate: (item) => path.extname(item) === '.json',
    },
    {
      name: 'modulesFieldName',
      type: 'input',
      message: 'Provide flexible field name inside JSON file',
    },
    {
      name: 'conflictAction',
      type: 'list',
      choices: ['ignore', 'overwrite'],
      default: 'ignore',
      message: 'Select action if file already exists',
    },
  ]);

  const { selectFileTypes } = await inquirer.prompt<{ selectFileTypes: AvailableFileType[] }>([
    {
      name: 'selectFileTypes',
      type: 'checkbox',
      choices: Object.values(AvailableFileType),
      default: ['php', 'scss'],
      message: `Select which file types you want to generate`,
      validate: (answer) => answer.length > 0 || 'You must select at least one',
    },
  ]);

  const fileTypes = {} as Record<AvailableFileType, FileType>;

  for await (const fileType of selectFileTypes) {
    type TemplatePrompt = SetOptional<Pick<FileType, 'template'>, 'template'> & {
      customTemplate: boolean;
    };
    const { template = 'default' } = await inquirer.prompt<TemplatePrompt>([
      {
        name: 'customTemplate',
        type: 'confirm',
        default: false,
        message: `${loggerPrefix(fileType)} Do you want to use custom EJS template?`,
      },
      {
        name: 'template',
        type: 'file-tree-selection',
        message: `${loggerPrefix(fileType)} Select EJS template`,
        validate: (item: string) => !!(path.extname(item) === '.ejs') || `You need .ejs extension`,
        when: (userAnswer: TemplatePrompt) => userAnswer.customTemplate,
      },
    ]);

    type OutputPrompt = Pick<FileType, 'output'>;
    const { output } = await inquirer.prompt<OutputPrompt>([
      {
        name: 'output',
        type: 'file-tree-selection',
        message: `${loggerPrefix(fileType)} Select directory where files should go`,
        onlyShowDir: true,
      },
    ]);

    type HaveImportsPrompt = { haveImports: boolean };
    const { haveImports } = await inquirer.prompt<HaveImportsPrompt>([
      {
        name: 'haveImports',
        type: 'confirm',
        default: fileType !== 'php',
        message: `${loggerPrefix(fileType)} Do ${fileType.toUpperCase()} need any imports?`,
      },
    ]);

    let importProperties: FileType['import'] | undefined;
    if (haveImports) {
      type ImportsPrompt = SetRequired<FileType, 'import'>['import'];
      const imports = await inquirer.prompt<ImportsPrompt>([
        {
          name: 'filePath',
          type: 'file-tree-selection',
          message: `${loggerPrefix(fileType)} Select file where you want to put your "imports"`,
          validate: (item: string) =>
            !!(path.extname(item) === `.${fileType.toLowerCase()}`) ||
            `You need .${fileType} extension`,
        },
        {
          name: 'search',
          type: 'input',
          message: `${loggerPrefix(fileType)} Search for a string`,
          suffix: ` This will be use to find last line containing this string`,
        },
        {
          name: 'append',
          type: 'input',
          message: `${loggerPrefix(fileType)} Provide "import" text which will be added to a file`,
          suffix: `\nYou may use ${loggerListElements(
            ['file_name', 'module_name', 'module_variable_name'],
            { parentheses: false, color: chalk.blue }
          )} as variables`,
        },
      ]);

      importProperties = { ...imports, filePath: getRelativePath(imports.filePath) };
    }

    // Config generation is deprecated and inquirer cannot return function
    const resolvedTemplate = template instanceof Function ? 'default' : template;

    fileTypes[fileType] = {
      active: true,
      template:
        resolvedTemplate !== 'default' ? getRelativePath(resolvedTemplate) : resolvedTemplate,
      output: getRelativePath(output),
      import: importProperties || undefined,
    };
  }

  const newConfig: AcfGeneratorConfig = {
    ...answers,
    modulesFilePath: getRelativePath(answers.modulesFilePath),
    fileTypes,
  };
  await saveConfig<AcfGeneratorConfig>(DEFAULT_CONFIG_FILENAME, newConfig);

  return newConfig;
};

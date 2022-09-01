import inquirer from 'inquirer';
import path from 'path';
import chalk from 'chalk';
import { AcfGeneratorConfig, AvailableFileType, FileType } from '../acf-generator.config.js';
import { saveConfig } from '../../../utils/saveConfig.js';
import { DEFAULT_CONFIG_FILENAME } from '../acf-generator.const.js';
import { loggerPrefix } from '../../../utils/logger-utils.js';

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
      validate: (answer) => (answer.length > 0 ? true : 'You must select at least one'),
    },
  ]);

  const fileTypes = {} as Record<AvailableFileType, FileType>;

  for await (const fileType of selectFileTypes) {
    const { customTemplate, template = 'default' } = await inquirer.prompt<{
      customTemplate: boolean;
      template?: string;
    }>([
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
        when: () => customTemplate,
      },
    ]);

    const { output } = await inquirer.prompt<{ output: string }>([
      {
        name: 'output',
        type: 'file-tree-selection',
        message: `${loggerPrefix(fileType)} Select directory where files should go`,
        onlyShowDir: true,
      },
    ]);

    const { haveImports } = await inquirer.prompt<{ haveImports: boolean }>([
      {
        name: 'haveImports',
        type: 'confirm',
        default: fileType !== 'php',
        message: `${loggerPrefix(fileType)} Do ${fileType.toUpperCase()} need any imports?`,
      },
    ]);

    let importProperties: FileType['import'] | undefined;
    if (haveImports) {
      const imports = await inquirer.prompt<{ filePath: string; search: string; append: string }>([
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
          suffix: `\nYou may use ${['file_name', 'module_name', 'module_variable_name']
            .map((s) => chalk.blue(s))
            .join(', ')} as variables`,
        },
      ]);

      importProperties = imports;
    }

    fileTypes[fileType] = {
      active: true,
      template,
      output,
      import: importProperties || undefined,
    };
  }

  const newConfig: AcfGeneratorConfig = { ...answers, fileTypes };
  await saveConfig<AcfGeneratorConfig>(DEFAULT_CONFIG_FILENAME, newConfig);

  return newConfig;
};

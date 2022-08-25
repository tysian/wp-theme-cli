import chalk from 'chalk';
import { QuestionCollection } from 'inquirer';
import path from 'path';

export const loggerPrefix = (fileType: string) => `[${chalk.cyanBright(fileType.toUpperCase())}]`;

export type FileTypeKey = 'php' | 'scss' | 'js';

export type FileType = {
  active: boolean;
  // 'default' -> use default template
  // path -> provide path to custom template
  template: 'default' | string;
  output: string;
  import?: {
    filePath: string;
    search: string;
    append: string;
  };
};

export type AcfGeneratorConfig = {
  modulesFilePath: string;
  modulesFieldName: string;
  conflictAction: 'ignore' | 'overwrite';
  fileTypes: Record<FileTypeKey, FileType>;
};

export const config: AcfGeneratorConfig = {
  modulesFilePath: './includes/acf-json/group_5d380bc6e0ae8.json',
  modulesFieldName: 'modules',
  conflictAction: 'ignore',
  fileTypes: {
    php: {
      active: true,
      template: 'default',
      output: './modules',
    },
    scss: {
      active: true,
      template: 'default',
      output: './src/scss/modules',
      import: {
        filePath: './src/scss/main.scss',
        search: `@import 'modules/`,
        append: `@import "modules/{file_name}";`,
      },
    },
    js: {
      active: false,
      template: 'default',
      output: './src/js/modules',
      import: {
        filePath: './src/js/modules/index.js',
        search: 'export',
        append: `export { {module_variable_name} } from './{file_name}.js';`,
      },
    },
  },
};

export type ConfigDescription = {
  fileTypes: Record<string, QuestionCollection[]>;
  [key: string]: QuestionCollection | ConfigDescription;
};

export const configDescriptions: ConfigDescription = {
  modulesFilePath: {
    type: 'file-tree-selection',
    message: 'Select JSON file with flexible field',
    validate: (item) => path.extname(item) === '.json',
    default: path.resolve(config.modulesFilePath),
  },
  modulesFieldName: {
    type: 'input',
    message: 'Provide flexible field name inside JSON file',
    default: config.modulesFieldName,
  },
  conflictAction: {
    type: 'list',
    choices: ['ignore', 'overwrite'],
    default: config.conflictAction,
    message: 'Select action if file already exists',
    suffix: ` Accepting values: 'ignore' | 'overwrite'`,
  },
  selectFileTypes: {
    type: 'checkbox',
    choices: Object.keys(config.fileTypes),
    default: ['php', 'scss'],
    message: `Select which file types you want to generate`,
    validate: (answer) => (answer.length > 0 ? true : 'You must select at least one'),
  },
  fileTypes: Object.keys(config.fileTypes).reduce(
    (acc, fileType) => ({
      ...acc,
      [fileType]: [
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
          validate: (item: string) =>
            path.extname(item) === '.ejs' ? true : `You need .ejs extension`,
          default: config.fileTypes[fileType as FileTypeKey].template,
          when: ({ customTemplate = false }) => customTemplate,
        },
        {
          name: 'output',
          type: 'file-tree-selection',
          message: `${loggerPrefix(fileType)} Select directory where files should go`,
          onlyShowDir: true,
          default: path.resolve(config.fileTypes[fileType as FileTypeKey].output),
        },
        {
          name: 'haveImports',
          type: 'confirm',
          default: fileType !== 'php',
          message: `${loggerPrefix(fileType)} Do ${fileType.toUpperCase()} need any imports?`,
        },
        {
          name: 'import.filePath',
          type: 'file-tree-selection',
          message: `${loggerPrefix(fileType)} Select file where you want to put your "imports"`,
          when: ({ haveImports = false }) => haveImports,
          default: path.resolve(config.fileTypes[fileType as FileTypeKey]?.import?.filePath ?? ''),
          validate: (item: string) =>
            path.extname(item) === `.${fileType.toLowerCase()}`
              ? true
              : `You need .${fileType} extension`,
        },
        {
          name: 'import.search',
          type: 'input',
          message: `${loggerPrefix(fileType)} Search for a string`,
          suffix: ` This will be use to find last line containing this string`,
          when: ({ haveImports = false }) => haveImports,
          default: config.fileTypes[fileType as FileTypeKey]?.import?.search ?? '',
        },
        {
          name: 'import.append',
          type: 'input',
          message: `${loggerPrefix(fileType)} Provide "import" text which will be added to a file`,
          suffix: `\nYou may use ${['file_name', 'module_name', 'module_variable_name']
            .map((s) => chalk.blue(s))
            .join(', ')} as variables`,
          when: ({ haveImports = false }) => haveImports,
          default: config.fileTypes[fileType as FileTypeKey]?.import?.append ?? '',
        },
      ],
    }),
    {} as Record<string, QuestionCollection[]>
  ),
};

export const printConfig = (configToPrint = config) => {
  console.dir(configToPrint, { depth: null });
};

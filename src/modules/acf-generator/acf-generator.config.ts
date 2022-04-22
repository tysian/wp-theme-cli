import chalk from 'chalk';
import { Answers, QuestionCollection } from 'inquirer';
import path from 'path';

export type FileTypeKey = 'php' | 'scss' | 'js';

export type FileType = {
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
  fileTypes: Partial<Record<FileTypeKey, FileType>>;
};

export const config: AcfGeneratorConfig = {
  modulesFilePath: './includes/acf-json/group_5d380bc6e0ae8.json',
  modulesFieldName: 'modules',
  conflictAction: 'ignore',
  fileTypes: {
    php: {
      template: 'default',
      output: './modules',
    },
    scss: {
      template: 'default',
      output: './src/scss/modules',
      import: {
        filePath: './src/scss/main.scss',
        search: '@import "modules/',
        append: '@import "modules/{filename}',
      },
    },
    js: undefined,
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
    validate: (answer) => (answer.length > 0 ? true : 'You must select at least'),
  },
  fileTypes: Object.keys(config.fileTypes).reduce((acc, fileType) => {
    const label = `[${chalk.cyanBright(fileType.toUpperCase())}]`;
    return {
      ...acc,
      [fileType]: [
        {
          name: 'customTemplate',
          type: 'confirm',
          default: fileType !== 'php',
          message: `${label} Do you want to use custom EJS template?`,
        },
        {
          name: 'template',
          type: 'file-tree-selection',
          message: `${label} Select EJS template for ${fileType.toUpperCase()} file`,
          validate: (item: string) =>
            path.extname(item) === '.ejs' ? true : `You need .ejs extension`,
          default: config.fileTypes[fileType as FileTypeKey]?.template,
          when: ({ customTemplate = false }) => customTemplate,
        },
        {
          name: 'output',
          type: 'file-tree-selection',
          message: `${label} Select directory where ${fileType.toUpperCase()} files should go`,
          onlyShowDir: true,
          default: path.resolve(config.fileTypes?.[fileType as FileTypeKey]?.output ?? ''),
        },
        {
          name: 'haveImports',
          type: 'confirm',
          default: false,
          message: `${label} Do ${fileType.toUpperCase()} need any imports?`,
        },
        {
          name: 'import.filePath',
          type: 'file-tree-selection',
          message: `${label} Select ${fileType.toUpperCase()} file where you want to put your "imports"`,
          when: ({ haveImports = false }) => haveImports,
          default: path.resolve(
            config.fileTypes?.[fileType as FileTypeKey]?.import?.filePath ?? ''
          ),
          validate: (item: string) =>
            path.extname(item) === `.${fileType.toLowerCase()}`
              ? true
              : `You need .${fileType} extension`,
        },
        {
          name: 'import.search',
          type: 'input',
          message: `${label} Search for a string`,
          suffix: ` This will be use to find last line containing this string`,
          when: ({ haveImports = false }) => haveImports,
          default: config.fileTypes?.[fileType as FileTypeKey]?.import?.search ?? '',
        },
        {
          name: 'import.append',
          type: 'input',
          message: `${label} Provide "import" text which will be added to ${fileType.toUpperCase()} file`,
          suffix: `\nYou may use ${chalk.blueBright('{filename}')}, ${chalk.blueBright(
            '{modulename}'
          )} as variables`,
          when: ({ haveImports = false }) => haveImports,
          default: config.fileTypes?.[fileType as FileTypeKey]?.import?.append ?? '',
        },
      ],
    };
  }, {} as Record<string, QuestionCollection[]>),
};

export const printConfig = () => {
  console.dir(config, { depth: null });
};

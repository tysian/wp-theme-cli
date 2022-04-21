import chalk from 'chalk';
import { QuestionCollection } from 'inquirer';
import path from 'path';

type FileTypeKey = 'php' | 'scss' | 'js';

type FileType = {
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
        filePath: './src/scss/mainModule.scss',
        search: '@import "modules/',
        append: '@import "modules/{filename}',
      },
    },
    js: undefined,
  },
};

export type ConfigDescription = {
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
    suffix: `Accepting values: 'ignore' | 'overwrite'`,
  },
  fileTypes: Object.keys(config.fileTypes).reduce((acc, fileType) => {
    return {
      ...acc,
      [fileType]: {
        [`create${fileType}`]: {},
        template: {
          type: 'file-tree-selection',
          message: `Select EJS template for ${fileType.toUpperCase()} file`,
          validate: (item: string) => path.extname(item) === '.ejs',
          default: config.fileTypes[fileType as FileTypeKey]?.template,
        },
        output: {
          type: 'file-tree-selection',
          message: `Select directory where ${fileType.toUpperCase()} files should go`,
          onlyShowDir: true,
        },
        import: {
          filePath: {
            type: 'file-tree-selection',
            message: `Select ${fileType.toUpperCase()} file where you want to put your "imports"`,
          },
          search: {
            type: 'input',
            message: `Search for a string`,
            suffix: `This will be use to find last line containing this string`,
          },
          append: {
            type: 'input',
            message: `Paste new import`,
            suffix: `Use ${chalk.blueBright('{filename}')}, ${chalk.blueBright(
              '{modulename}'
            )} variables if you need to.`,
          },
        },
      },
    };
  }, {} as ConfigDescription),
};

export const printConfig = () => {
  console.dir(config, { depth: null });
};

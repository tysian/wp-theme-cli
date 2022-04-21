import chalk from 'chalk';
import { QuestionCollection } from 'inquirer';
import path from 'path';

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
  fileTypes: Partial<Record<'php' | 'scss' | 'js', FileType>>;
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

export const configDescriptions: Record<
  string,
  QuestionCollection | Record<string, QuestionCollection>
> = {
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
  fileTypes: {
    template: {
      type: 'file-tree-selection',
      message: `Select EJS template for {filetype} file`,
      validate: (item) => path.extname(item) === '.ejs',
    },
    output: {
      type: 'file-tree-selection',
      message: 'Select directory where {filetype} files should go',
      onlyShowDir: true,
    },
    'import.filePath': {
      type: 'file-tree-selection',
      message: `Select {filename} file where you want to put your "imports"`,
    },
    'import.search': {
      type: 'input',
      message: `Search for a string`,
      suffix: `This will be use to find last line containing this string`,
    },
    'import.append': {
      type: 'input',
      message: `Paste new import`,
      suffix: `Use ${chalk.blueBright('{filename}')}, ${chalk.blueBright(
        '{modulename}'
      )} variables if you need to.`,
    },
  },
};

export const printConfig = () => {
  console.log(config);
};


export type AcfGeneratorConfig = {
  modulesFilePath: string;
  modulesFieldName: string;
  conflictAction: 'ignore' | 'overwrite';
  template: {
    // 'none' -> don't create file
    // 'default' -> use default template
    // path -> provide path to custom template
    php: 'none' | 'default' | string;
    scss: 'none' | 'default' | string;
  };
  output: {
    php: string;
    scss: string;
  };
  scssImport: {
    filePath: string;
    lookFor: string;
  };
};

export const config: AcfGeneratorConfig = {
  modulesFilePath: './includes/acf-json/group_5d380bc6e0ae8.json',
  modulesFieldName: 'modules',
  conflictAction: 'ignore',
  template: {
    php: 'default',
    scss: 'default',
  },
  output: {
    php: './modules/',
    scss: './src/scss/modules/',
  },
  scssImport: {
    filePath: './src/scss/main.scss',
    lookFor: '@import "modules/',
  },
};

export const configDescriptions: Record<string, string> = {
  modulesFilePath: 'Relative to a JSON file with flexible field',
  modulesFieldName: 'Flexible field name inside JSON',
  conflictAction: `Default action if the file already exists
  Accepting values: 'ignore' | 'overwrite'`,
  template: `Relative path to EJS template file for specific file type
  Accepting values:
  'none' -> don't create file
  'default' -> use default template
  string -> provide relative path to custom template`,
  output: 'Relative path to specific filetypes',
  scssImport: `Settings required to properly import created scss files
  filePath: relative path to main scss file which is used for importing
  lookFor: search for a last line containing this string, then paste new imports below it`,
};

export const printConfig = () => {
  console.log(config);
};

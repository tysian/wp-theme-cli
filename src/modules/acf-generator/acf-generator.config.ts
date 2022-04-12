type AcfGeneratorConfig = {
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

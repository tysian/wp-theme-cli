const defaultConfig = {
  modulesFilePath: './includes/acf-json/group_5d380bc6e0ae8.json',
  modulesFieldName: 'modules',
  conflictAction: 'ignore', // 'ignore' or 'overwrite'
  template: {
    // 'none' -> don't create file
    // 'default' -> use default template
    // path -> provide path to custom template
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

module.exports = {
  defaultConfig,
};

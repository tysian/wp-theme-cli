import inquirer from 'inquirer';
import path from 'path';
import { getObjectFromJSON } from './getObjectFromJSON.js';

export const getExternalConfig = async <Config>(defaultConfig: string) => {
  // Ask for external config path
  const { externalConfigFile } = await inquirer.prompt([
    {
      type: 'file-tree-selection',
      message: 'Select external config file',
      name: 'externalConfigFile',
      default: defaultConfig,
      validate: (item: string) => path.extname(item) === '.json' || `You need json extension`,
    },
  ]);

  const config = await getObjectFromJSON<Config>(externalConfigFile);
  return config as Config;
};

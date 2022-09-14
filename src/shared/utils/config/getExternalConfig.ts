import path from 'path';
import inquirer from 'inquirer';
import { getObjectFromJSON } from './getObjectFromJSON.js';

export const getExternalConfig = async <Config>(defaultConfig: string) => {
  // Ask for external config path
  const { externalConfigFile } = await inquirer.prompt<{ externalConfigFile: string }>([
    {
      type: 'file-tree-selection',
      message: 'Select external config file',
      name: 'externalConfigFile',
      default: defaultConfig,
      validate: (item: string) => path.extname(item) === '.json' || `You need json extension`,
    },
  ]);

  const config: Config = await getObjectFromJSON(externalConfigFile);
  return config;
};

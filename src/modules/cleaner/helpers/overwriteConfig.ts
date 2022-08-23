import inquirer from 'inquirer';
import { CleanerConfig } from '../cleaner.config.js';

export const overwriteConfig = async (): Promise<CleanerConfig> => {
  console.log('overwrite');
  let overwrittenConfig: CleanerConfig = {
    name: '',
    description: '',
  };

  const answers = inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'The name of the config',
      default: '',
    },
    {
      type: 'input',
      name: 'description',
      message: 'Description of the config',
      default: '',
    },
  ]);
  overwrittenConfig = { ...overwrittenConfig, ...answers };

  return overwrittenConfig;
};

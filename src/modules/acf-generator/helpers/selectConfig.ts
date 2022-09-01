import inquirer from 'inquirer';
import path from 'path';
import { fileExists } from '../../../utils/fileExist.js';
import { readStream } from '../../../utils/readStream.js';
import { AcfGeneratorConfig } from '../acf-generator.config.js';
import { DEFAULT_CONFIG_PATH } from '../acf-generator.const.js';
import { createNewConfig } from './createNewConfig.js';

export const selectConfig = async (): Promise<AcfGeneratorConfig> => {
  const { configType } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select config type',
      name: 'configType',
      default: 'default',
      choices: [
        {
          name: 'Create new config',
          value: 'create-new',
          short: 'create new',
        },
        {
          name: 'Use external config',
          value: 'external-config-file',
          short: 'external',
        },
      ],
    },
  ]);

  if (configType === 'create-new') {
    const overwrittenConfig = await createNewConfig();

    return overwrittenConfig;
  }

  if (configType === 'external-config-file') {
    // Ask for external config path
    const externalConfigFilePath = await fileExists(DEFAULT_CONFIG_PATH).catch(() => '');
    const { externalConfigFile } = await inquirer.prompt([
      {
        type: 'file-tree-selection',
        message: 'Select external config file',
        name: 'externalConfigFile',
        default: externalConfigFilePath || null,
        validate: (item: string) => path.extname(item) === '.json' || `You need json extension`,
      },
    ]);

    const externalConfigContent = await readStream(externalConfigFile);
    try {
      const parsedConfig = JSON.parse(externalConfigContent);
      return parsedConfig;
    } catch (e) {
      throw new Error(`Invalid JSON file - ${externalConfigFile}`);
    }
  }

  throw new Error('Wrong config type.');
};

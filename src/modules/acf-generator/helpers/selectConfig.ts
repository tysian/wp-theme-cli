import path from 'path';
import inquirer from 'inquirer';
import { config, configDescriptions } from '../acf-generator.config';
import { fileExists } from '../../../utils/fileExist';
import { readStream } from '../../../utils/readStream';
import { overwriteConfig } from './overwriteConfig';
import { ACF_GENERATOR_DEFAULT_CONFIG_PATH } from '../../../constants.js';

export const selectConfig = async <ConfigType>(): Promise<ConfigType> => {
  const { configType } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select config type',
      name: 'configType',
      default: 'default',
      choices: [
        {
          name: 'Default config',
          value: 'default',
          short: 'default',
        },
        {
          name: 'Overwrite default config',
          value: 'overwrite',
          short: 'overwrite',
        },
        {
          name: 'External config file',
          value: 'external-config-file',
          short: 'external',
        },
      ],
    },
  ]);

  if (configType === 'default') {
    return config as ConfigType;
  }

  if (configType === 'overwrite') {
    const overwrittenConfig = await overwriteConfig(config, configDescriptions);

    return overwrittenConfig as ConfigType;
  }

  if (configType === 'external-config-file') {
    // Ask for external config path
    const externalConfigFilePath = await fileExists(ACF_GENERATOR_DEFAULT_CONFIG_PATH).catch(
      () => ''
    );
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

  return config as ConfigType;
};

import inquirer from 'inquirer';
import path from 'path';
import { fileExists } from '../../../utils/fileExist.js';
import { logger } from '../../../utils/logger.js';
import { readStream } from '../../../utils/readStream.js';
import { CleanerConfig } from '../cleaner.config.js';
import { DEFAULT_CONFIG_PATH } from '../cleaner.const.js';
import { overwriteConfig } from './overwriteConfig.js';

const getConfigFromFile = async (file: string = DEFAULT_CONFIG_PATH) => {
  const config = await readStream(file);
  try {
    const parsedConfig = JSON.parse(config);
    return parsedConfig;
  } catch (error) {
    throw new Error(`Invalid JSON file - ${DEFAULT_CONFIG_PATH}`);
  }
};

export const selectConfig = async (): Promise<CleanerConfig> => {
  const defaultConfigExists = await fileExists(DEFAULT_CONFIG_PATH).catch(() => '');

  const configTypeChoices = [
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
  ];

  if (defaultConfigExists) {
    configTypeChoices.unshift({
      name: `Default config (${DEFAULT_CONFIG_PATH})`,
      value: 'default',
      short: 'default',
    });
  }

  const { configType } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select config type',
      name: 'configType',
      default: 'default',
      choices: configTypeChoices,
    },
  ]);

  if (configType === 'default') {
    // Show current config and ask for overwrite
    logger.info(`Using config found in ${DEFAULT_CONFIG_PATH}`);
    const config = await getConfigFromFile(DEFAULT_CONFIG_PATH);
    return config as CleanerConfig;
  }

  if (configType === 'overwrite') {
    const config = await overwriteConfig();
    return config as CleanerConfig;
  }

  if (configType === 'external-config-file') {
    // Ask for external config path
    const { externalConfigFile } = await inquirer.prompt([
      {
        type: 'file-tree-selection',
        message: 'Select external config file',
        name: 'externalConfigFile',
        default: defaultConfigExists ? DEFAULT_CONFIG_PATH : null,
        validate: (item: string) => path.extname(item) === '.json' || `You need json extension`,
      },
    ]);

    const config = await getConfigFromFile(externalConfigFile);
    return config as CleanerConfig;
  }

  // Well, this should never happen
  return {} as CleanerConfig;
};

import inquirer from 'inquirer';
import { fileExists } from '../../../utils/fileExist.js';
import { getConfigFromFile } from '../../../utils/getConfigFromFile.js';
import { getExternalConfig } from '../../../utils/getExternalConfig.js';
import { logger } from '../../../utils/logger.js';
import { CleanerConfig } from '../cleaner.config.js';
import { DEFAULT_CONFIG_PATH } from '../cleaner.const.js';
import { overwriteConfig } from './overwriteConfig.js';

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
    const config = await getExternalConfig<CleanerConfig>(DEFAULT_CONFIG_PATH);
    return config as CleanerConfig;
  }

  // Well, this should never happen
  return {} as CleanerConfig;
};

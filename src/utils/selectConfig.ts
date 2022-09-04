import inquirer from 'inquirer';
import { fileExists } from './fileExist.js';
import { getExternalConfig } from './getExternalConfig.js';
import { getObjectFromJSON } from './getObjectFromJSON.js';
import { logger } from './logger.js';

type SelectConfigArgs<Config> = {
  defaultConfigPath: string;
  createNewConfig: () => Config | Promise<Config>;
};

export const selectConfig = async <Config>({
  defaultConfigPath,
  createNewConfig,
}: SelectConfigArgs<Config>): Promise<Config> => {
  const configTypeChoices = [
    {
      name: 'Create new config',
      value: 'create-new-config',
      short: 'create new config',
    },
    {
      name: 'External config file',
      value: 'external-config-file',
      short: 'use external config',
    },
  ];

  const defaultConfigExists = await fileExists(defaultConfigPath).catch(() => false);
  if (defaultConfigExists) {
    configTypeChoices.unshift({
      name: `Default config (${defaultConfigPath})`,
      value: 'default',
      short: 'default',
    });
  }

  type ConfigType = 'default' | 'create-new-config' | 'external-config-file';
  const { configType } = await inquirer.prompt<{ configType: ConfigType }>([
    {
      type: 'list',
      message: 'Select config type',
      name: 'configType',
      default: 'default',
      choices: configTypeChoices,
    },
  ]);

  switch (configType) {
    case 'default': {
      // Show current config and ask for overwrite
      logger.info(`Using config found in ${defaultConfigPath}`);
      const config: Config = await getObjectFromJSON(defaultConfigPath);
      return config;
    }
    case 'create-new-config': {
      const config: Config = await createNewConfig();
      return config;
    }
    case 'external-config-file': {
      const config: Config = await getExternalConfig(defaultConfigPath);
      return config;
    }
    default:
      // Well, this should never happen
      return {} as Config;
  }
};

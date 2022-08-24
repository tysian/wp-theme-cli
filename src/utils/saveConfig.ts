import chalk from 'chalk';
import filenamify from 'filenamify';
import inquirer from 'inquirer';
import { DEFAULT_CONFIGS_DIR } from '../constants.js';
import { fileExists } from './fileExist.js';
import { logger, updateLogger } from './logger.js';
import { writeStream } from './writeStream.js';

const handleFileName = (filename: string) => {
  const cleanFilename = filenamify(filename).trim().toLowerCase();
  if (!cleanFilename) return '';
  return cleanFilename.endsWith('.json') ? cleanFilename : `${cleanFilename}.json`;
};

export const saveConfig = async <Config>(filename: string, config: Config): Promise<void> => {
  const defaultFilename = handleFileName(filename);
  if (!defaultFilename) return;

  const defaultConfigDir = await fileExists(DEFAULT_CONFIGS_DIR)
    .then(() => DEFAULT_CONFIGS_DIR)
    .catch(() => '.');

  // Ask user if they want to save this config
  const { wannaSave } = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'Do you want to save this config?',
      name: 'wannaSave',
      default: false,
    },
  ]);

  if (!wannaSave) return;

  logger.info(`New config will be saved in ${chalk.green(`${defaultConfigDir}/`)}`);
  const { userFilename } = await inquirer.prompt<{ userFilename: string }>([
    {
      type: 'input',
      message: 'Pass the config file name',
      name: 'userFilename',
      default: defaultFilename,
      validate: async (input: string) => {
        const exists = await fileExists(`${defaultConfigDir}/${input}`)
          .then(() => 'File already exists')
          .catch(() => true);
        return exists;
      },
    },
  ]);

  const finalFilename = handleFileName(userFilename);
  const finalPath = `${defaultConfigDir}/${finalFilename}`;

  updateLogger.start(`Creating ${chalk.green(finalFilename)}`);
  await writeStream(finalPath, JSON.stringify(config, null, 2));
  updateLogger.success(`Config ${chalk.green(finalFilename)} saved successfully.`);
  updateLogger.done();
};

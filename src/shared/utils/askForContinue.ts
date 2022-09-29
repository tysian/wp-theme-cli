import inquirer from 'inquirer';
import { logger } from './log/logger.js';

export const askForContinue = async (message = 'Do you want to continue?'): Promise<boolean> => {
  logger.none();
  const { shouldContinue = true } = await inquirer.prompt<{ shouldContinue: boolean }>([
    {
      name: 'shouldContinue',
      type: 'confirm',
      message,
      default: true,
    },
  ]);

  return shouldContinue;
};

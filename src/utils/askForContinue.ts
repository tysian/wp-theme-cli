import inquirer from 'inquirer';

export const askForContinue = async (message = 'Do you want to continue?'): Promise<boolean> => {
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

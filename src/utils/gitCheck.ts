import inquirer from 'inquirer';
import git from 'simple-git';
import { log } from './logger';

export const gitCheck = async (): Promise<boolean> => {
  log('Checking git status...');

  const isRepo = await git().checkIsRepo();
  if (!isRepo) {
    return true;
  }

  const status = await git().status();
  if (status.isClean()) {
    return true;
  }

  const { whatToDo } = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'Current branch has uncommited changes. Do you want to continue? ',
      name: 'whatToDo',
      default: false,
    },
  ]);

  return whatToDo;
};

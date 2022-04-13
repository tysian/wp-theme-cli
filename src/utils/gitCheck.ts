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
      type: 'expand',
      message: 'You got uncommited changes, what should we do?',
      default: 'y',
      choices: [
        {
          key: 'c',
          name: 'Commit my changes now',
          value: 'commit',
        },
        {
          key: 'i',
          name: 'Ignore my changes & continue without commiting',
          value: 'continue',
        },
        {
          key: 'x',
          name: 'Abort',
          value: 'abort',
        },
      ],
    },
  ]);

  if (whatToDo === 'commit') {
    const { commitMessage } = await inquirer.prompt([
      {
        type: 'input',
        name: 'commitMessage',
        message: 'Provide commit message',
        default: () => 'Changes before generating ACF modules files',
      },
    ]);
  } else if (whatToDo === 'continue') {
    return true;
  } else if (whatToDo === 'abort') {
    return false;
  }

  return whatToDo;
};


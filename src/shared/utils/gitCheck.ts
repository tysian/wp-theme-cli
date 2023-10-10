import inquirer from 'inquirer';
import { simpleGit, SimpleGit } from 'simple-git';
import { merge } from 'lodash-es';
import { DEFAULT_COMMIT_MSG } from '$/constants.js';
import { updateLogger } from './log/logger.js';

const git: SimpleGit = simpleGit();

export type GitCheckOptions = {
  /**
   * Default action for uncommited changes
   * * ask - show prompt and ask user what should we do
   * * commit - commit with default message
   * * abort - throw error on uncommited changes
   * @default 'ask'
   */
  defaultAction?: 'ask' | 'commit' | 'abort';
  /**
   * @default 'chore: save wip changes'
   */
  defaultMessage?: string;
  abortErrorMessage?: string;
};

export const gitCommit = async (message: string, add = '.') => {
  updateLogger.done();
  updateLogger.start('Commiting');
  await git.add(add);
  await git.commit(message);
  updateLogger.complete('Changes commited successfully!');
  updateLogger.done();
};

export const gitCheck = async (opts: GitCheckOptions = {}) => {
  const options = merge(
    {
      defaultAction: 'ask',
      defaultMessage: DEFAULT_COMMIT_MSG,
      abortErrorMessage: `Can't proceed, please stash or commit your changes first.`,
    } as Required<GitCheckOptions>,
    opts
  );

  if (typeof options.defaultMessage !== 'string') {
    options.defaultMessage = DEFAULT_COMMIT_MSG;
  }

  // Check if repo exists
  updateLogger.done();
  updateLogger.start('Looking for git repository...');
  const isRepo = await git.checkIsRepo();
  if (!isRepo) {
    updateLogger.warn('No repo found.');
    updateLogger.done();
    return;
  }

  // Check git status
  updateLogger.pending('Checking git status...');
  const status = await git.status();
  if (status.isClean()) {
    updateLogger.skip('Nothing to commit, continuing...');
    updateLogger.done();
    return;
  }

  // Uncommited changes found
  updateLogger.info('You have uncommited changes.');
  switch (options.defaultAction) {
    case 'ask': {
      const { shouldCommit } = await inquirer.prompt<{
        shouldCommit: 'commit' | 'continue' | 'abort';
      }>([
        {
          type: 'list',
          message: 'Do you want to commit?',
          name: 'shouldCommit',
          default: 'commit',
          choices: [
            {
              name: 'Commit my changes now',
              short: 'Commit',
              value: 'commit',
            },
            {
              name: 'Ignore my changes & continue without commiting',
              short: 'Ignore & continue',
              value: 'continue',
            },
            { type: 'separator' },
            {
              name: 'Abort',
              value: 'abort',
            },
          ],
        },
      ]);

      switch (shouldCommit) {
        case 'commit': {
          const { commitMessage } = await inquirer.prompt<{ commitMessage: string }>([
            {
              type: 'input',
              name: 'commitMessage',
              message: 'Provide commit message.',
              default: options.defaultMessage,
              validate: (input) => input.trim().length > 0,
            },
          ]);

          await gitCommit(commitMessage);
          break;
        }

        case 'continue': {
          updateLogger.done();
          updateLogger.skip('Continuing without commiting.');
          updateLogger.done();
          break;
        }

        case 'abort': {
          throw new Error('Abort!');
        }

        default:
          break;
      }

      break;
    }

    case 'commit': {
      await gitCommit(options.defaultMessage);
      break;
    }

    case 'abort':
      throw new Error(options.abortErrorMessage);

    default:
      break;
  }
};

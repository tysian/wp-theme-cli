import chalk from 'chalk';
import {
  loggerRelativePath,
  loggerPrefix,
  updateLogger,
  loggerMergeMessages,
} from '$/shared/utils/index.js';

type OperationsLoggerArgs = {
  relativePath: string;
  prefix: string;
  message: string;
};

export class OperationsLogger {
  public relativePath: OperationsLoggerArgs['relativePath'];

  public prefix: OperationsLoggerArgs['prefix'];

  public message: OperationsLoggerArgs['message'];

  constructor({ relativePath = '', prefix = '', message = '' }: OperationsLoggerArgs) {
    this.relativePath = loggerRelativePath(relativePath);
    this.prefix = prefix ? loggerPrefix(prefix) : '';
    this.message = message;
  }

  public start(msg: string) {
    updateLogger.start(loggerMergeMessages([this.prefix, msg, this.relativePath]));
  }

  public skip(msg = loggerMergeMessages([chalk.gray(`${this.message}`), 'No changes were made'])) {
    updateLogger.skip(loggerMergeMessages([this.prefix, msg, this.relativePath]));
    updateLogger.done();
  }

  public complete() {
    updateLogger.complete(loggerMergeMessages([this.prefix, this.message, this.relativePath]));
    updateLogger.done();
  }
}

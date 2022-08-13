import chalk from 'chalk';
import { log } from '../../../utils/logger.js';
import { OPERATION_TYPE } from '../cleaner.const.js';

export class AppResult {
  constructor(operationType = OPERATION_TYPE.DEFAULT, disableLogging = []) {
    this._success = null;
    this._errorMessage = '';
    this._operationType = operationType;
    this._disableLogging = disableLogging;
  }

  get success() {
    return this._success;
  }

  set success(success = true) {
    this._success = success;
  }

  get errorMessage() {
    return this._errorMessage;
  }

  set errorMessage(message = '') {
    if (message.trim() !== '') {
      this._success = false;
    }

    this._errorMessage = message;
  }

  log(file = '', message = '') {
    const disableLogging = this._disableLogging;
    const dontLog = Array.isArray(disableLogging) ? disableLogging : [disableLogging];
    const shouldLog = !(
      (this._success && dontLog.includes('success')) ||
      (this._success === null && dontLog.includes('unchanged')) ||
      (!this._success && dontLog.includes('error'))
    );
    if (shouldLog) {
      let type = 'Processing';
      switch (this._operationType) {
        case OPERATION_TYPE.REMOVE_FILE:
          type = 'Remove file';
          break;

        case OPERATION_TYPE.REMOVE_FILE_LINE:
          type = 'Remove line';
          break;

        case OPERATION_TYPE.BATCH_FILES:
          type = 'Modify multiple files';
          break;

        case OPERATION_TYPE.MODIFY_JSON:
          type = 'Update JSON';
          break;

        case OPERATION_TYPE.REMOVE_DIRECTORY:
          type = 'Remove directory';
          break;

        default:
          break;
      }

      const hasError = !!String(this._errorMessage).length;
      const isSuccess = this._success;
      log(
        [
          `${type} in ${file}`.trim(),
          message.length ? `\n${chalk.bold('Message')}: ${message}` : ``,
          hasError ? `\n${chalk.red('Error message')}: ${this._errorMessage}` : ``,
        ].join(''),
        isSuccess ? 'success' : isSuccess === null ? 'unchanged' : 'error'
      );
    }
  }
}

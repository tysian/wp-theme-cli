import chalk from 'chalk';
import { readStream } from '../../../utils/readStream.js';
import { writeStream } from '../../../utils/writeStream.js';
import { OPERATION_TYPE } from '../cleaner.const.js';
import { AppResult } from '../helpers/AppResult.js';

export const modifyJSON = async (file = '', options = {}) => {
  const { callback, disableLogging = [] } = options;
  const result = new AppResult(OPERATION_TYPE.MODIFY_JSON, disableLogging);
  const fileExt = file.split('.')[file.split('.').length - 1];

  if (
    file.length &&
    fileExt.toLowerCase() === 'json' &&
    callback &&
    typeof callback === 'function'
  ) {
    try {
      const fileContent = await readStream(file);
      // Remove callback from options before returning
      const callbackOptions = { ...options };
      delete callbackOptions.callback;

      const modifiedFileContent = JSON.stringify(
        callback(JSON.parse(fileContent), options),
        null,
        2
      );

      // If something was changed - update file
      if (fileContent.length !== modifiedFileContent.length) {
        await writeStream(file, modifiedFileContent);
        result.success = true;
      }
    } catch (error) {
      result.errorMessage = error.message;
    }
  } else if (fileExt.toLowerCase() !== 'json') {
    result.errorMessage = `Wrong file extension (${fileExt}). Consider providing JSON file`;
  } else if (!callback || typeof callback !== 'function') {
    result.errorMessage = `Callback must be an function`;
  } else {
    result.errorMessage = `Empty ${chalk.italic('file')} parameter.`;
  }

  result.log(file);
  return result.success;
};

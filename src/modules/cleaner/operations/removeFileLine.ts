import chalk from 'chalk';
import { readStream } from '../../../utils/readStream.js';
import { writeStream } from '../../../utils/writeStream.js';
import { OperationType } from '../cleaner.const.js';
import { AppResult } from '../helpers/AppResult.js';
import { removeLineInText } from '../helpers/removeLineInText.js';

export const removeFileLine = async (file = '', options = {}) => {
  const { search = '', disableLogging = [] } = options;
  const result = new AppResult(OperationType.REMOVE_FILE_LINE, disableLogging);

  if (search.length && file.length) {
    try {
      const fileExt = file.split('.')[file.split('.').length - 1];
      const fileContent = await readStream(file);
      let modifiedFileContent = removeLineInText(fileContent, search);

      // Remove empty <?php ?> from .php file
      if (fileExt.trim().toLowerCase() === 'php') {
        modifiedFileContent = modifiedFileContent.replace(/\s?<\?php(\s)*\?>\s?/gim, '');
      }

      // If something was changed - update file
      if (fileContent.length !== modifiedFileContent.length) {
        await writeStream(file, modifiedFileContent);
        result.success = true;
      }
    } catch (error) {
      result.errorMessage = error.message;
    }
  } else {
    result.errorMessage = `Please provide a ${chalk.italic('file')} and ${chalk.italic(
      'options.search'
    )} parameters`;
  }

  result.log(file);
  return result.success;
};

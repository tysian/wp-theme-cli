import path from 'path';
import chalk from 'chalk';
import { loggerListElements, readStream, writeStream } from '$/shared/utils/index.js';
import { asArray } from '$/shared/utils/asArray.js';
import { handleError } from '$/shared/utils/handleError.js';
import { RemoveFileLineOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { OperationsLogger } from '../helpers/OperationLogger.js';
import { removeLineInText } from '../helpers/removeLineInText.js';

export const removeFileLine = async (
  file: string,
  { groupKey = '', description = '', search }: RemoveFileLineOperation,
  statistics: CleanerStatistics
) => {
  const operationLogger = new OperationsLogger({
    relativePath: file,
    prefix: groupKey,
    message: description || 'Update file',
  });

  try {
    operationLogger.start('Updating file');

    if (!file.length || !search.length) {
      throw new Error(
        `Empty ${loggerListElements(['file', 'search'], {
          color: chalk.green,
          parentheses: false,
          separator: ' or ',
        })} values.`
      );
    }

    const fileContent = await readStream(file);
    let modifiedFileContent = fileContent;

    for (const singleSearch of asArray(search)) {
      modifiedFileContent = removeLineInText(modifiedFileContent, singleSearch);
    }

    // Remove empty <?php ?> from .php file
    const fileExt = path.extname(file);
    if (fileExt === '.php') {
      modifiedFileContent = modifiedFileContent.replace(/\s?<\?php(\s)*\?>\s?/gim, '');
    }

    if (fileContent.length === modifiedFileContent.length) {
      operationLogger.skip();
      statistics.incrementStat('unchanged');
      return null;
    }

    // If something was changed - update file
    await writeStream(file, modifiedFileContent);

    operationLogger.complete();
    statistics.incrementStat('modified');
    return true;
  } catch (error) {
    statistics.incrementStat('error');
    handleError(error as Error, operationLogger.prefix);
    return false;
  }
};

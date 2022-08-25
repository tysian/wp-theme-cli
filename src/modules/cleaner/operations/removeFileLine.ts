import chalk from 'chalk';
import path from 'path';
import { asArray } from '../../../utils/asArray.js';
import { fileExists } from '../../../utils/fileExist.js';
import { handleError } from '../../../utils/handleError.js';
import {
  loggerRelativePath,
  loggerPrefix,
  loggerMergeMessages,
} from '../../../utils/logger-utils.js';
import { updateLogger } from '../../../utils/logger.js';
import { readStream } from '../../../utils/readStream.js';
import { writeStream } from '../../../utils/writeStream.js';
import { RemoveFileLineOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { removeLineInText } from '../helpers/removeLineInText.js';

export const removeFileLine = async (
  file: string,
  { groupKey = '', description = '', search }: RemoveFileLineOperation,
  statistics: CleanerStatistics
) => {
  const relativePath = loggerRelativePath(file);
  const prefix = groupKey ? loggerPrefix(groupKey) : '';
  const message = description || 'Updated file';
  try {
    updateLogger.start(loggerMergeMessages([prefix, `Updating file`, relativePath]));
    if (!file.length || !search.length) {
      throw new Error(`Empty ${chalk.green('file')} or ${chalk.green('search')} values.`);
    }
    const fileExt = path.extname(file);
    await fileExists(file);
    const fileContent = await readStream(file);
    let modifiedFileContent = fileContent;

    asArray(search).forEach((singleSearch) => {
      modifiedFileContent = removeLineInText(modifiedFileContent, singleSearch);
    });

    // Remove empty <?php ?> from .php file
    if (fileExt === '.php') {
      modifiedFileContent = modifiedFileContent.replace(/\s?<\?php(\s)*\?>\s?/gim, '');
    }

    // If something was changed - update file
    if (fileContent.length !== modifiedFileContent.length) {
      await writeStream(file, modifiedFileContent);
      updateLogger.complete(loggerMergeMessages([prefix, message, relativePath]));
      updateLogger.done();
      statistics.incrementStat('modified');
      return true;
    }
  } catch (error) {
    statistics.incrementStat('error');
    handleError(error as Error, prefix);
    return false;
  }

  updateLogger.skip(loggerMergeMessages([prefix, `No changes were made`, relativePath]));
  updateLogger.done();
  statistics.incrementStat('unchanged');
  return null;
};

import chalk from 'chalk';
import path from 'path';
import { asArray } from '../../../utils/asArray.js';
import { fileExists } from '../../../utils/fileExist.js';
import { handleError } from '../../../utils/handleError.js';
import { readStream } from '../../../utils/readStream.js';
import { writeStream } from '../../../utils/writeStream.js';
import { RemoveFileLineOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { removeLineInText } from '../helpers/removeLineInText.js';

export const removeFileLine = async (
  file: string,
  { search }: RemoveFileLineOperation,
  statistics: CleanerStatistics
) => {
  try {
    if (!search.length || !file.length) {
      statistics.incrementStat('error');
      throw new Error(
        `Please provide a ${chalk.green('file')} and ${chalk.green('search')} parameters.`
      );
    }
    const fileExt = path.extname(file);
    await fileExists(file);
    const fileContent = await readStream(file);
    let modifiedFileContent = fileContent;

    asArray(search).forEach((singleSearch) => {
      removeLineInText(fileContent, singleSearch);
    });

    // Remove empty <?php ?> from .php file
    if (fileExt === '.php') {
      modifiedFileContent = modifiedFileContent.replace(/\s?<\?php(\s)*\?>\s?/gim, '');
    }

    // If something was changed - update file
    if (fileContent.length !== modifiedFileContent.length) {
      await writeStream(file, modifiedFileContent);
      statistics.incrementStat('modified');
      return true;
    }
  } catch (error) {
    statistics.incrementStat('error');
    handleError(error as Error);
    return false;
  }
  statistics.incrementStat('unchanged');
  return null;
};

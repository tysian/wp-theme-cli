import path from 'path';
import { readStream, writeStream } from '$/shared/utils/index.js';
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
      statistics.addFile('unchanged', file);
      return;
    }

    // If something was changed - update file
    await writeStream(file, modifiedFileContent);

    operationLogger.complete();
    statistics.addFile('modified', file);
  } catch (error) {
    statistics.addFile('error', file);
    handleError(error as Error, operationLogger.prefix);
  }
};

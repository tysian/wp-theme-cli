import { isEqual } from 'lodash-es';
import { getObjectFromJSON, writeStream } from '$/shared/utils/index.js';
import { asArray } from '$/shared/utils/asArray.js';
import { handleError } from '$/shared/utils/handleError.js';
import { RemoveFromJSONOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { OperationsLogger } from '../helpers/OperationLogger.js';
import { unsetInObject } from '../helpers/unsetInObject.js';

export const removeFromJSON = async (
  file: string,
  { groupKey = '', description = '', propertyPaths = [] }: RemoveFromJSONOperation,
  statistics: CleanerStatistics
): Promise<boolean | null> => {
  const operationLogger = new OperationsLogger({
    relativePath: file,
    prefix: groupKey,
    message: description || 'Removed from JSON',
  });

  try {
    operationLogger.start('Removing in JSON');

    const parsedFileContent: object = await getObjectFromJSON(file);
    const propertyPathsArray = asArray(propertyPaths);
    const modifiedFileContent = unsetInObject(parsedFileContent, propertyPathsArray);

    if (isEqual(parsedFileContent, modifiedFileContent)) {
      operationLogger.skip();
      statistics.incrementStat('unchanged');
      return null;
    }

    // Stringify object and write to file
    const stringifiedModifiedContent = JSON.stringify(modifiedFileContent, null, 2);
    await writeStream(file, stringifiedModifiedContent);

    operationLogger.complete();
    statistics.incrementStat('modified');
    return true;
  } catch (error) {
    handleError(error as Error, operationLogger.prefix);
    statistics.incrementStat('error');
    return false;
  }
};

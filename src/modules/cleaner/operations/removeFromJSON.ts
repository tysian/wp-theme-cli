import { getObjectFromJSON } from '../../../utils/getObjectFromJSON.js';
import { handleError } from '../../../utils/handleError.js';
import { writeStream } from '../../../utils/writeStream.js';
import { RemoveFromJSONOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { unsetInObject } from '../helpers/unsetInObject.js';

export const removeFromJSON = async (
  file: string,
  { propertyPaths }: RemoveFromJSONOperation,
  statistics: CleanerStatistics
): Promise<boolean | null> => {
  try {
    const parsedFileContent: object = await getObjectFromJSON(file);
    const modifiedFileContent = unsetInObject(parsedFileContent, propertyPaths);

    const stringifiedContent = JSON.stringify(parsedFileContent, null, 2);
    const stringifiedModifiedContent = JSON.stringify(modifiedFileContent, null, 2);

    // If something was changed - update file
    if (stringifiedContent.length !== stringifiedModifiedContent.length) {
      await writeStream(file, stringifiedModifiedContent);
      statistics.incrementStat('modified');
      return true;
    }
  } catch (error) {
    handleError(error as Error);
    statistics.incrementStat('error');
    return false;
  }

  statistics.incrementStat('unchanged');
  return null;
};

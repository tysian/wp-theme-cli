import { AcfGroup } from '../../../types.js';
import { getObjectFromJSON } from '../../../utils/getObjectFromJSON.js';
import { handleError } from '../../../utils/handleError.js';
import { updateLogger } from '../../../utils/logger.js';
import { writeStream } from '../../../utils/writeStream.js';
import { RemoveACFLayoutOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { unsetInObject } from '../helpers/unsetInObject.js';
import {
  loggerListElements,
  loggerMergeMessages,
  loggerPrefix,
  loggerRelativePath,
} from '../../../utils/logger-utils.js';
import { asArray } from '../../../utils/asArray.js';

export const removeACFLayout = async (
  file: string,
  { groupKey = '', description = '', layouts = [] }: RemoveACFLayoutOperation,
  statistics: CleanerStatistics
) => {
  const relativePath = loggerRelativePath(file);
  const prefix = groupKey ? loggerPrefix(groupKey) : '';
  const message = description || 'Removed ACF Layout';
  const layoutsArray = asArray(layouts);

  try {
    updateLogger.start(
      loggerMergeMessages([prefix, `Removing ACF Layouts`, loggerListElements(layoutsArray)])
    );

    const acfModulesGroup: AcfGroup = await getObjectFromJSON(file);

    const acfModulesIndex = acfModulesGroup.fields.findIndex(({ name = '' }) => name === 'modules');
    const acfModule = acfModulesIndex > -1 ? acfModulesGroup.fields[acfModulesIndex] : null;

    if (!acfModule || acfModule?.type !== 'flexible_content' || !acfModule?.layouts) {
      throw new Error('No flexible_content field.');
    }

    const removePaths = Object.values(acfModule.layouts)
      .filter(({ name = '' }) => layoutsArray.includes(name))
      .map(({ key }) => `fields[${acfModulesIndex}].layouts[${key}]`);

    const modifiedAcfGroup = unsetInObject(acfModulesGroup, removePaths);

    const stringifiedContent = JSON.stringify(acfModulesGroup, null, 2);
    const stringifiedModifiedContent = JSON.stringify(modifiedAcfGroup, null, 2);

    // If something was changed - update file
    if (stringifiedContent.length !== stringifiedModifiedContent.length) {
      await writeStream(file, stringifiedModifiedContent);

      updateLogger.complete(loggerMergeMessages([prefix, message, relativePath]));
      updateLogger.done();
      statistics.incrementStat('modified');
      return true;
    }
  } catch (error) {
    handleError(error as Error, prefix);
    statistics.incrementStat('error');
    return false;
  }

  updateLogger.skip(
    loggerMergeMessages([prefix, `Didn't remove any layout`, loggerListElements(layoutsArray)])
  );
  updateLogger.done();
  statistics.incrementStat('unchanged');
  return null;
};

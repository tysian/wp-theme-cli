import { isEqual } from 'lodash-es';
import { AcfGroup } from '../../../types.js';
import { getObjectFromJSON } from '../../../utils/getObjectFromJSON.js';
import { handleError } from '../../../utils/handleError.js';
import { writeStream } from '../../../utils/writeStream.js';
import { RemoveACFLayoutOperation } from '../cleaner.config.js';
import { CleanerStatistics } from '../cleaner.const.js';
import { unsetInObject } from '../helpers/unsetInObject.js';
import { loggerListElements, loggerMergeMessages } from '../../../utils/logger-utils.js';
import { asArray } from '../../../utils/asArray.js';
import { OperationsLogger } from '../helpers/OperationLogger.js';

export const removeACFLayout = async (
  file: string,
  { groupKey = '', description = '', layouts = [] }: RemoveACFLayoutOperation,
  statistics: CleanerStatistics
) => {
  const operationLogger = new OperationsLogger({
    relativePath: file,
    prefix: groupKey,
    message: description || 'Removed ACF Layout',
  });

  const layoutsArray = asArray(layouts);
  try {
    operationLogger.start(
      `${loggerMergeMessages(['Removing ACF Layouts', loggerListElements(layoutsArray)])}`
    );

    const acfModulesGroup: AcfGroup = await getObjectFromJSON(file);

    const acfModulesIndex = acfModulesGroup.fields.findIndex(({ name }) => name === 'modules');
    const acfModule = acfModulesIndex > -1 ? acfModulesGroup.fields[acfModulesIndex] : null;

    if (!acfModule || acfModule?.type !== 'flexible_content' || !acfModule?.layouts) {
      throw new Error('No flexible_content field.');
    }

    const removePaths = Object.values(acfModule.layouts)
      .filter(({ name }) => layoutsArray.includes(name))
      .map(({ key }) => `fields[${acfModulesIndex}].layouts[${key}]`);

    const modifiedAcfModulesGroup = unsetInObject(acfModulesGroup, removePaths);

    if (isEqual(acfModulesGroup, modifiedAcfModulesGroup)) {
      operationLogger.skip(
        loggerMergeMessages([`Didn't remove any layout`, loggerListElements(layoutsArray)])
      );
      statistics.incrementStat('unchanged');
      return null;
    }

    // Stringify object and write to file
    const stringifiedModifiedContent = JSON.stringify(modifiedAcfModulesGroup, null, 2);
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

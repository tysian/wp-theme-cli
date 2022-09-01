import { askForContinue } from '../../utils/askForContinue.js';
import { gitCheck } from '../../utils/gitCheck.js';
import { logger, updateLogger } from '../../utils/logger.js';
import { checkConfig } from './helpers/checkConfig.js';
import { getAcfModules } from './helpers/getAcfModules.js';
import { selectConfig } from './helpers/selectConfig.js';
import { writeModules } from './helpers/writeModules.js';

export const acfGenerator = async (): Promise<boolean> => {
  logger.none('ACF Flexible field files generator!');

  try {
    // Check if there are any uncommited changes
    await gitCheck();

    const finalConfig = await selectConfig();
    await checkConfig(finalConfig);

    const shouldContinue = await askForContinue();
    if (!shouldContinue) {
      return true;
    }

    const acfModules = await getAcfModules(
      finalConfig.modulesFilePath,
      finalConfig.modulesFieldName
    );

    // Create files
    await writeModules(acfModules, finalConfig);
  } catch (error) {
    updateLogger.error((error as Error)?.message);
    updateLogger.done();
  }

  return true;
};

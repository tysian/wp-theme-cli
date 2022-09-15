import { askForContinue } from '$/shared/utils/askForContinue.js';
import { gitCheck } from '$/shared/utils/gitCheck.js';
import { logger, selectConfig, updateLogger } from '$/shared/utils/index.js';
import { AcfGeneratorConfig } from './acf-generator.config.js';
import { DEFAULT_CONFIG_PATH } from './acf-generator.const.js';
import { checkConfig } from './helpers/checkConfig.js';
import { createNewConfig } from './helpers/createNewConfig.js';
import { getAcfModules } from './helpers/getAcfModules.js';
import { writeModules } from './helpers/writeModules.js';

export const acfGenerator = async (): Promise<void> => {
  logger.none('ACF Flexible field files generator!');

  try {
    // Check if there are any uncommited changes
    await gitCheck();

    const finalConfig = await selectConfig<AcfGeneratorConfig>({
      defaultConfigPath: DEFAULT_CONFIG_PATH,
      createNewConfig,
    });
    await checkConfig(finalConfig);

    if (!(await askForContinue())) {
      return;
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
};

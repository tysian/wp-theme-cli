import { logger, updateLogger } from '../../utils/logger';
import { gitCheck } from '../../utils/gitCheck';
import { printConfig } from './acf-generator.config';
import type { AcfGeneratorConfig } from './acf-generator.config';
import { selectConfig } from './helpers/selectConfig';
import { getAcfModules } from './helpers/getAcfModules';
import { writeModules } from './helpers/writeModules';
import { checkConfig } from './helpers/checkConfig';

export const acfGenerator = async (): Promise<boolean> => {
  logger.none('ACF Flexible field files generator!');

  try {
    // Check if there are any uncommited changes
    await gitCheck();

    // Show current config and ask for overwrite
    logger.info('Here is default config of this generator.');
    printConfig();

    const finalConfig = await selectConfig<AcfGeneratorConfig>();
    await checkConfig(finalConfig);

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

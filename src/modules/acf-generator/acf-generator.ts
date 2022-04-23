import { logger } from '../../utils/logger';
import { gitCheck } from '../../utils/gitCheck';
import { printConfig } from './acf-generator.config';
import { overwriteConfig } from './helpers/overwriteConfig';
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

    const overwrittenConfig = await overwriteConfig();
    await checkConfig(overwrittenConfig);

    // const acfModules = await getAcfModules(
    //   overwrittenConfig.modulesFilePath,
    //   overwrittenConfig.modulesFieldName
    // );

    // // Create files
    // await writeModules(acfModules, overwrittenConfig);
  } catch (error) {
    logger.error((error as Error)?.message);
  }

  return true;
};

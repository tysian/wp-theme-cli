import { logger } from '../../utils/logger';
import { gitCheck } from '../../utils/gitCheck';
import { config, printConfig } from './acf-generator.config';
import { overwriteConfig } from './helpers/overwriteConfig';
import { fileExists } from '../../utils/fileExist';
import { relativeToAbsolutePath } from '../../utils/relativeToAbsolutePath';

export const acfGenerator = async (): Promise<boolean> => {
  logger.none('ACF Flexible field files generator!');

  // Check if there are any uncommited changes
  const gitCheckStatus = await gitCheck();
  if (!gitCheckStatus) {
    return false;
  }

  // Show current config and ask for overwrite
  logger.info('Here is default config of this generator.');
  printConfig();

  const overwriteConfigStatus = await overwriteConfig();
  if (!overwriteConfigStatus) {
    return false;
  }

  // Check if modulesFilePath exists
  const modulesFilePathFileExists = await fileExists(
    relativeToAbsolutePath(config.modulesFieldName)
  );

  if (!modulesFilePathFileExists) {
    logger.debug(config.modulesFieldName);
    logger.error(`modulesFieldName JSON file doesn't exist.`);
    return false;
  }

  // Check if modules field here exists
  // check template option for php & for scss
  // check if output directories exist
  // check if scssImport file exist
  // check if lookFor value exist in file

  // create array of files to create (exclude files with "none" template)
  // create files in loop
  //    check if file exist
  //    if yes - do conflictAction
  //    if scss file - additionaly add import to main.scss file

  return true;
};

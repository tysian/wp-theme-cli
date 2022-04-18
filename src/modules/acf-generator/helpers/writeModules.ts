import { fileExists } from '../../../utils/fileExist';
import { logger } from '../../../utils/logger';
import { relativeToAbsolutePath } from '../../../utils/relativeToAbsolutePath';
import { AcfGeneratorConfig } from '../acf-generator.config';
import { AcfField, AcfLayout } from './getAcfModules';

export const writeModules = async (acfModules: AcfLayout[], config: AcfGeneratorConfig) => {
  logger.start('Creating files');
  // Check if outputs exists

  const createModule = async () => {};
  // check if scssImport file exist
  // check if lookFor value exist in file
  // create array of files to create (exclude files with "none" template)
  // check template option for php & for scss
  // create files in loop
  //    check if file exist
  //    if yes - do conflictAction
  //    if scss file - additionaly add import to main.scss file
};


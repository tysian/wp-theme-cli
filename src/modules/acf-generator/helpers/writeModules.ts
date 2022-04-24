import { logger } from '../../../utils/logger';
import { AcfGeneratorConfig, FileType, FileTypeKey } from '../acf-generator.config';
import { AcfField, AcfLayout } from './getAcfModules';

type Module = {
  layout: AcfLayout;
  fileTypes: Record<FileTypeKey, FileType>;
};

const createModule = async ({ layout, fileTypes }: Module): Promise<boolean> => {
  return true;
};

export const writeModules = async (acfModules: AcfLayout[], config: AcfGeneratorConfig) => {
  logger.none(); // just empty line
  logger.start('Creating files');
  const { fileTypes, conflictAction } = config;

  console.log(acfModules);
  for (const layout of acfModules) {
    const returnValue = await createModule({ layout, fileTypes });
  }

  // const tempArray = [];
  // for (const [fileType, options] of Object.entries(fileTypes)) {
  //   tempArray.push({...options, fileType: fileType})
  // }

  // create array of files to create
  // check template option
  // create files in loop
  //    if file exist - do conflictAction
  //    if has imports - additionaly add perform an import action
};

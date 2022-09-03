import path from 'path';
import { ROOT_DIR } from '../../../constants.js';
import { AvailableFileType } from '../acf-generator.config.js';

export const getDefaultTemplate = (fileType: AvailableFileType) =>
  path.resolve(
    `${ROOT_DIR}/../public/acf-generator/templates/template.${fileType.toLowerCase()}.ejs`
  );

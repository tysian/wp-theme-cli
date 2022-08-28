import path from 'path';
import { ROOT_DIR } from '../../../constants.js';
import { FileTypeKey } from '../acf-generator.config.js';

export const getDefaultTemplate = (fileType: FileTypeKey) =>
  path.resolve(`${ROOT_DIR}/../public/templates/template.${fileType.toLowerCase()}.ejs`);

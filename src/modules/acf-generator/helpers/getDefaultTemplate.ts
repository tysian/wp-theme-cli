import path from 'path';
import { rootDirectory } from '../../../utils/constants.js';
import type { FileTypeKey } from '../acf-generator.config.js';

export const getDefaultTemplate = (fileType: FileTypeKey) =>
  path.resolve(`${rootDirectory}/../public/templates/template.${fileType.toLowerCase()}.ejs`);

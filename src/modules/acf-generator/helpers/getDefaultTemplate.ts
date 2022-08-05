import path from 'path';
import { rootDirectory } from '@src/utils/constants.js';
import type { FileTypeKey } from '../acf-generator.config.js';

export const getDefaultTemplate = (fileType: FileTypeKey) =>
  path.resolve(`${rootDirectory}/../public/templates/template.${fileType.toLowerCase()}.ejs`);

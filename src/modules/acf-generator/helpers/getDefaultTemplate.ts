import { AvailableFileType } from '../acf-generator.config.js';
import * as templates from '../templates/index.js';

export const getDefaultTemplate = (fileType: AvailableFileType): string => templates[fileType];

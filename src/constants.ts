import path from 'path';
import { fileURLToPath } from 'url';

export const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_CONFIGS_DIR = './configs';

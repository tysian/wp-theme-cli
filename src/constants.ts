import path from 'path';
import { fileURLToPath } from 'url';

export const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_CONFIGS_DIR = './.configs';
export const ACF_GENERATOR_DEFAULT_CONFIG = `${DEFAULT_CONFIGS_DIR}/acf-generator.config.json`;

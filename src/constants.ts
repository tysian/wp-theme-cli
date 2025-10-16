import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_COMMIT_MSG = 'chore: save wip changes';
export const ROOT_DIR = path.dirname(fileURLToPath(import.meta.url));
export const DEFAULT_CONFIGS_DIR = './configs';

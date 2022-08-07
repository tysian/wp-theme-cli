import path from 'path';
import { fileURLToPath } from 'url';

export const rootDirectory = path.dirname(fileURLToPath(`${import.meta.url}/../`));

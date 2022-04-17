import fs from 'fs/promises';

export const fileExists = async (path: string) => !!(await fs.stat(path).catch(() => false));

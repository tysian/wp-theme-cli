import path from 'node:path';

export const getRelativePath = (absolutePath = process.cwd()) =>
  path.relative(process.cwd(), absolutePath);

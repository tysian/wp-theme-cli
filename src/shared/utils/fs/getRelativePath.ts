import path from 'path';

export const getRelativePath = (absolutePath = process.cwd()) =>
  path.relative(process.cwd(), absolutePath);

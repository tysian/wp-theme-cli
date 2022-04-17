import path from 'path';

export const relativeToAbsolutePath = (relativePath: string) => {
  return relativePath.startsWith('./')
    ? path.resolve(process.cwd(), relativePath.replace('./', ''))
    : relativePath;
};

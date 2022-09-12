export const replaceAll = (find: string, replace: string, string: string) =>
  string.replace(new RegExp(find, 'g'), replace);

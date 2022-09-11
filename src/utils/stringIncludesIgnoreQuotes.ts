import { replaceAll } from './replaceAll.js';

export const stringIncludesIgnoreQuotes = (inputString: string, searchString: string): boolean =>
  replaceAll(`"`, `'`, inputString).includes(replaceAll(`"`, `'`, searchString));

// src: https://stackoverflow.com/a/34820855

import { EOL } from 'os';

export const getEOL = (text: string) => {
  const m = text.match(/\r\n|\n/g);
  const u = (m && m.filter((a: string) => a === '\n').length) ?? 0;
  const w = (m && m.length - u) ?? 0;
  if (u === w) {
    return EOL; // use the OS default
  }
  return u > w ? '\n' : '\r\n';
};

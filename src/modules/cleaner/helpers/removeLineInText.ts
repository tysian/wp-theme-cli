import { getEOL } from '../../../utils/getEOL.js';

export const removeLineInText = (text: string, search: string): string => {
  if (!text.trim() || !search.trim()) {
    return text;
  }

  const searchPhrases = Array.isArray(search) ? search : [search];
  const EOL = getEOL(text);

  return text
    .split(EOL)
    .filter((line) => !searchPhrases.some((phrase) => line.includes(phrase)))
    .join(EOL);
};

// src: https://stackoverflow.com/a/34820855

const { EOL } = require('os');

function getEOL(text) {
  const m = text.match(/\r\n|\n/g);
  const u = m && m.filter((a) => a === '\n').length;
  const w = m && m.length - u;
  if (u === w) {
    return EOL; // use the OS default
  }
  return u > w ? '\n' : '\r\n';
}

module.exports = getEOL;

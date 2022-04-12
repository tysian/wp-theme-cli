const fs = require('fs');

module.exports = function (file, text) {
  return new Promise((resolve, reject) => {
    const writable = fs.createWriteStream(file);

    writable.write(text);

    writable.on('finish', () => {
      resolve();
    });

    writable.end();

    writable.on('error', (error) => {
      reject(error);
    });
  });
};

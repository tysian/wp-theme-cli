const fs = require('fs');

module.exports = function (file) {
  return new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file);
    let fileContent = '';
    stream.on('data', (data) => {
      fileContent += data;
    });

    stream.on('close', () => {
      resolve(fileContent);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });
};

import fs from 'node:fs';

export const writeStream = (file: string, text: string) =>
  new Promise((resolve, reject) => {
    const writable = fs.createWriteStream(file);

    writable.write(text);

    writable.on('finish', () => {
      resolve(file);
    });

    writable.end();

    writable.on('error', (error) => {
      reject(error);
    });
  });

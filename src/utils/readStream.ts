import fs from 'fs';

export const readStream = (file: string) =>
  new Promise((resolve, reject) => {
    const stream = fs.createReadStream(file);
    let fileContent = '';
    stream.on('data', (data: string) => {
      fileContent += data;
    });

    stream.on('close', () => {
      resolve(fileContent);
    });

    stream.on('error', (error) => {
      reject(error);
    });
  });

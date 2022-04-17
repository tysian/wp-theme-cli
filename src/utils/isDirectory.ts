import { lstat, PathLike } from 'fs';

export async function isDirectory(path: PathLike) {
  return new Promise((resolve) => {
    lstat(path, (err, stat) => {
      if (!err) {
        resolve(stat.isDirectory());
      } else {
        resolve(false);
      }
    });
  });
}

# wp-theme-cli

## 1.2.2

### Patch Changes

- 59ee92c: bump tsup version to 8.3.0

## 1.2.1

### Patch Changes

- 2fb3279: Replace deprecated function `fs.rmdir()`, `fs.unlink()` with `fs.rm()`

## 1.2.0

### Minor Changes

- d725b9c: Create tool for generating WordPress meta file - style.css using package.json from current working directory

## 1.1.1

### Patch Changes

- f1b7f6b: Update dependencies, bump typescript to 5.2

## 1.1.0

### Minor Changes

- 03450fa: Update statistics to count files to prevent duplicates

## 1.0.2

### Patch Changes

- 6b22b70:
  - Update docs
  - Add prepublish script
  - Fix error when installing dependencies

## 1.0.0

### Major Changes

- 815ac9f: Added new module - cleaning your template based on provided config. More info can be found [here](/docs/cleaner.md)

## 0.8.0

### Minor Changes

- 172132a: Move shared utils into separate feature-related directories, add absolute paths with proper eslint linting
- bff5931: Move all shared utils from cleaner branch, because they will be pretty usefull in main branch too.
  Added some spacings and other tweaks to logging in config checking or git checking.
  Created Statistics object in ACF Generator module and they look pretty nice now.

# WP Theme CLI

## Goal

Bootstrapping new WP projects might be time consuming. I've decided to create this CLI to automate some of tasks.  
For now, I'm focusing on files operations, such as removing unnecessary files or creating new ones.

> **Warning**
>
> This package is still in beta, and some of features are about removing or modifying files.  
> Please, make sure that you are in correct folder and you are using version control system (eg. git).  
> You are using this tool for your own responsibility.

## Requirements

- Node 14.18.0 or >=16.12.0

## Installation

Preferred way is to run latest version directly using `npx` or `pnpx`

```bash
npx wp-theme-cli@latest
```

```bash
pnpx wp-theme-cli@latest
```

You can also install it locally or globally, but this way is **NOT RECOMMENDED**.

## Available options

Check all commands available using help command

```bash
wp-theme-cli --help
```

Each feature is called a **module** and have separate documentation:

1. [ACF Generator](docs/acf-generator.md) - Generate files based on flexible field layouts
2. [Cleaner](docs/cleaner.md) - Remove directories, files, update files by removing lines of code, update JSON files (cleaner)

## Credits

All npm/husky/changeset/commitlint related stuff, typescript building setup was inspired by [create-t3-app](https://github.com/t3-oss/create-t3-app).

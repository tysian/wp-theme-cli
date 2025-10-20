# WP Theme CLI

## Goal

Bootstrapping new WP projects might be time consuming. I've decided to create this CLI to automate some of tasks.  
For now, I'm focusing on files operations, such as removing unnecessary files or creating new ones.

> [!WARNING]
>
> Please, make sure that you are in correct folder and you are using version control system (eg. git).  
> You are using this tool for your own responsibility.

## Requirements

- Node 20.3.0 or >=22.0.0
- npm >=9.6.5
- pnpm >=7.1.0

## Installation

You can run latest version directly using `npx`:

```bash
npx wp-theme-cli@latest
```

Or install install it locally:

```bash
npm install wp-theme-cli --save-dev
```

## Configuration

> [!IMPORTANT]
> In v2 the old configuration based on json filed is no longer supported.  
> From now on we use one config file for all kind of operations.  
> New config is fully typed and documented. It also allows you to create templates using functions, etc.

Create `theme.config.js`, `theme.config.mjs` or `theme.config.ts`, then import `defineConfig` function from `wp-theme-cli`.

You can also read more reading documentation below.

```typescript
// theme.config.js
import { defineConfig } from 'wp-theme-cli';

export default defineConfig({
  // put your options here...
});
```

## Available options

Check all commands available using help command

```bash
wp-theme-cli --help
```

Each feature is called a **module** and have separate documentation:

1. [ACF Generator](docs/acf-generator.md) - Generate files based on flexible field layouts
2. [Cleaner](docs/cleaner.md) - Remove directories, files, update files by removing lines of code, update JSON files (cleaner)
3. [Create style.css](docs/create-style-css.md) - Create `style.css` WP meta file using `package.json`

## Credits

All npm/husky/changeset/commitlint related stuff, typescript building setup was inspired by [create-t3-app](https://github.com/t3-oss/create-t3-app).

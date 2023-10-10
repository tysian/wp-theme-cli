# Create WordPress style.css meta file

## Goal

WordPress template uses `style.css` as its file with metadata

> [!NOTE]
>
> This tool is meant to be used along with `wp-theme-cli bump` (coming soon!).  
> Our goal is to bump version, then generate style.css using this tool.  
> Then we commit, create tag and push to main branch.

## Usage

Use `wp-theme-cli create-style-css` command.

### Don't overwrite

Pass `--dont-overwrite` option to prevent from overwriting existing style.css

### No interactive

Use `--no-interactive` options to disable all interactive feature.

This means that if you have any uncommited changes, they will be automatically commited before running this tool.

### Commit after generating

By using `--commit` option, newly created style.css file will be automatically commited.

You can also overwrite default commit message by using `-m "message"` or `--message "message"` option.

### Validating schema

You can also use `--validate` option to validate your data against [WordPress requirements](https://developer.wordpress.org/themes/basics/main-stylesheet-style-css/).

## Preparing your `package.json`

`style.css` will be generated based on package.json in your current working directory.

Some properties will be inhertied directly from `package.json` but some need to be provided inside special wordpress property.

This tool will look for `wp`, `wordpress` or `wp-theme-cli` key in your `package.json`, here you can provide all your data for your `style.css`.

| Name                       | Key                 | Description                                                                   | Inherits if empty         |
| :------------------------- | :------------------ | :---------------------------------------------------------------------------- | :------------------------ |
| Theme Name **(\*)**        | `theme_name`        | Theme name                                                                    | `name`                    |
| Theme URI                  | `theme_uri`         | Theme URL                                                                     | `homepage`                |
| Author **(\*)**            | `author`            | Author name                                                                   | `author` or `author.name` |
| Author URI                 | `author_uri`        | Author URL                                                                    | `author.url`              |
| Description **(\*)**       | `description`       | Description                                                                   | `description`             |
| Version **(\*)**           | `version`           | Version - always inherited from `package.json`                                | `version`                 |
| Tags                       | `tags`              | Array of tags                                                                 | `keywords`                |
| Requires at least **(\*)** | `requires_at_least` | The oldest supported WordPress version (in X.X format)                        | ❌                        |
| Tested up to **(\*)**      | `tested_up_to`      | The last supported WordPress version (in X.X format)                          | ❌                        |
| Requires PHP **(\*)**      | `requires_php`      | The oldest PHP version supported (in X.X format)                              | ❌                        |
| License **(\*)**           | `license`           | License                                                                       | `license`                 |
| License URI **(\*)**       | `license_uri`       | License URL                                                                   | ❌                        |
| Text Domain **(\*)**       | `text_domain`       | The string used for textdomain for translation.                               | `name` (kebab-cased)      |
| Domain Path                | `domain_path`       | Location of translations when theme is disabled <br />(default: `/languages`) | ❌                        |
| Template                   | `template`          | If Child Theme - pass parent here                                             | ❌                        |

_**(\*)** - required when using `--validate` option_

### Example `package.json`

```json
{
  "name": "your-theme",
  "version": "1.6.0",
  "dependencies": {},
  "devDependencies": {},
  // ...
  "wordpress": {
    "theme_name": "Theme name",
    "theme_uri": "Theme URI",
    "author": "Author",
    "author_uri": "Author URI",
    "description": "Description",
    "tags": ["tag1", "tag2"],
    "requires_at_least": "5.4",
    "tested_up_to": "6.3",
    "requires_php": "7.4",
    "license": "GNU General Public License v3.0 (or later)",
    "license_uri": "https://www.gnu.org/licenses/gpl-3.0.html",
    "text_domain": "your-theme"
  }
}
```

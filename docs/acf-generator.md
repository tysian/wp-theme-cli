# ACF Flexible field files generator

## Goal

Generate, update & remove files in our WordPress theme

### Installation

1. Clone repository
2. Run `npm install` or `yarn install` to install dependencies
3. Install this module globally `npm i -g .`
4. Use it everywhere `wp-theme`
5. To remove this module, just run `npm uninstall -g wp-theme`

## Usage

Use `wp-theme generate` command.  
The only type available for a moment is _modules_.
This command allows you to create your own config, so you feel free to generate one using this tools.

If you already have a config, you can pass its path during setup process.

If you put it as `./.configs/acf-generator.config.json` it will be automatically detected.

### Generating modules

Run `wp-theme generate modules` to generate/update ACF modules files.  
Now you'll see a default config, but you can easily overwrite it by answering questions via CLI.

**modulesFilePath**  
Accepts: `string`  
This is the path to ACF JSON file.

> You need to enable json sync feature in your WordPress ACF settings.\
> This field group **MUST** have at least one flexible field at the root level.

**modulesFieldName**  
Accepts: `string`  
The flexible field name.

**conflictAction**  
Accepts: `string`  
Options: `ignore` | `overwrite`  
Action when file already exists.

**selectFileTypes**  
Accepts: `string`  
Currently available: `php`, `scss`, `js`  
Select which file types you want to generate.

**fileTypes**  
Accepts: `object`  
Available keys: `'php'` | `'scss'` | `'js'`

**\[fileType].active**  
Accepts: `boolean`  
If `true` - creates files for this file type.

**\[fileType].template**  
Accepts: `string`  
Default: `'default'`  
EJS template file, should have `.ejs` extension.

**\[fileType].output**  
Accepts: `string`  
Select directory where files should go.

**\[fileType].import**  
Accepts: `object`  
Options for importing feature.

**\[fileType].import.filePath**  
Accepts: `string`  
Path to main import file, where imports are stored.

**\[fileType].import.search**  
Accepts: `string`  
Search for the last line containing this string, new imports will be added under this one.  
The `"` character will be replaced with `'` while searching (only).

**\[fileType].import.append**  
Accepts: `string`  
String to append in main import file. You can use variables such as: `file_name`, `module_name`, `module_variable_name`.
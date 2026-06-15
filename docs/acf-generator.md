# ACF Flexible field files generator

## Goal

Generate, update & remove files in our WordPress theme

## Usage

Use `wp-theme-cli generate` command.  
The only type available for a moment is _modules_.
This command allows you to create your own config, so you feel free to generate one using this tools.

If you already have a config, you can pass its path during setup process.

If you put it as `./configs/default.acf-generator-config.json` it will be automatically detected.

### Generating modules

Run `wp-theme-cli generate modules` to generate/update ACF modules files.  
You can easily generate config by answering questions via CLI.  
You might also want to see example config [here](/example-configs/example.acf-generator-config.json).

**modulesFilePath**  
Accepts: `string`  
This is the path to ACF JSON file.  
This property is **DEPRECATED**. You should use `'modulesDirectory'` and `'modulesGroupKey'` instead.

> You need to enable json sync feature in your WordPress ACF settings.\
> This field group **MUST** have at least one flexible field at the root level.

**modulesDirectory**  
Accepts: `string`  
Path to directory with all ACF JSON files.

**modulesGroupKey**  
Accepts: `string`  
Key of the group with flexible field.

**modulesFieldName**  
Accepts: `string`  
The flexible field name.

**conflictAction**  
Accepts: `string`  
Options: `'ignore'` | `'overwrite'`  
Default: `'ignore'`  
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
Here is an data object provided to the template:

```ts
type ModuleData = {
  /** Layout name */
  name: string;
  /** Layout name in PascalCase */
  namePascalCase: string;
  /** Layout name in camelCase */
  nameCamelCase: string;
  /** Layout name in snake_case */
  variableName: string;
  /** File name with extension */
  fileName: string;
  /** Layout name in kebab-case */
  className: string;
  /** Array of layout subfields */
  subfields: ModuleDataSubfield[];
};

type ModuleDataSubfield = {
  /** Subfield key */
  name: string;
  /** Subfield key in snake_case */
  variableName: string;
};
```

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

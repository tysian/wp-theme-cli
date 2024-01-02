# WordPress template cleaner

## Goal

Our goal is to have one complete template, but being able to clear it from stuff you don't actually need for current project.

## Usage

Use `wp-theme-cli clean` command.

## Configs

### Structure

Config file have a `name`, `description` and `groups` fields.

Each group is a separate set of `operations`. Operation is an instruction how provided file/files should be treated.

Currently you can select on of those operations, one of `OperationType` type:

- remove file (`REMOVE_FILE`)
- remove directory (`REMOVE_DIRECTORY`)
- remove line of text from file (`REMOVE_FILE_LINE`)
- modifying JSON file (`MODIFY_JSON`)
- remove something from JSON file (`REMOVE_FROM_JSON`)
- remove flexible field layout from ACF local JSON file (`REMOVE_ACF_LAYOUT`)

### Base operation structure

| Parameter       | Type                   | Description                                |
| :-------------- | :--------------------- | :----------------------------------------- |
| `operationType` | `OperationType`        | **Required**. Type of operation            |
| `input`\*       | `string` \| `string[]` | **Required**. One or many files to process |
| `exclude`\*     | `string` \| `string[]` | _Optional_. Exclude files from search      |
| `description`   | `string`               | _Optional_. Description                    |

_\* This tool uses [`fast-glob`](https://github.com/mrmlnc/fast-glob) library to get search for files. [Pattern syntax](https://github.com/mrmlnc/fast-glob#pattern-syntax) can be used. This is where `exclude` parameter might be useful._

### Additional parameters

Some operations require more informations to work.

### Remove file line

| Parameter | Type                   | Description                                                              |
| :-------- | :--------------------- | :----------------------------------------------------------------------- |
| `search`  | `string` \| `string[]` | **Required**. Search for specific text and remove line if text was found |

### Remove ACF layout

| Parameter | Type                   | Description                                                                                |
| :-------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| `layouts` | `string` \| `string[]` | **Required**. Look for ACF Flexible field layouts and remove them from ACF Local JSON file |

### Remove from JSON

| Parameter       | Type                   | Description                                                                                |
| :-------------- | :--------------------- | :----------------------------------------------------------------------------------------- |
| `propertyPaths` | `string` \| `string[]` | **Required**. Remove selected properties using lodash `unset` path, eg. <br />`'a[0].b.c'` |

## Select config

Tool will look for default config in default location, which is `./configs/default.cleaner-config.json`

Depends on existence of default config, you might have 2 or 3 options to choose.

### Use default config

Tool will use default config.

### Create new config

Basically you'll be asked bunch of questions and new config file will be created.

You have to create at least one group, which cannot be empty. Each

> Create a group using `common` key. This group will be automatically included when running a tool.

### External config file

Choose config file using interactive file.

You can create it using this tool or do it by itself:

```js
// awesome.cleaning-config.json
{
  name: 'Example config',
  description: 'Description of example config',
  groups: [
    // ...
    {
      name: 'Example group',
      key: 'example-group',
      operations: [
        // ...
        {
          operationType: 'REMOVE_FILE',
          description: 'Example operation',
          input: ['/404.php'],
        },
        // ...
      ],
    },
    // ...
  ],
}
```

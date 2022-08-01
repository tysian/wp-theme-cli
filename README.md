# WP-Theme CLI

## Goal

Starting new WP projects can be time consuming. I've decided to create this CLI to automate some of tasks.  
For now, I'm focusing on files operations, such as removing unnecessary files or creating new ones.

> ⚠ Warning
>
> This package is still in beta, and some of features are about removing or modifying files.  
> Please, make sure that you are in correct folder and you are using version control system (eg. git).  
> You are using this tool for your own responsibility.

## Requirements

- Node >= 14.17.0

## Available options

Check all commands available using help command

```bash
wp-theme --help
```

### Generate modules

In my company, the **modules** are simply a flexible field rows, and we are using separate file for each module.  
You can use this command to generate files for flexible field.

```bash
wp-theme generate modules
```

For more informations, please check [this](/docs/acf-generator.md).

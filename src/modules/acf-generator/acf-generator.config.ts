export enum AvailableFileType {
  PHP = 'php',
  SCSS = 'scss',
  JS = 'js',
}

export type FileType = {
  /**
   * Inactive file types won't be generated
   *
   * @deprecated Active state is determined by its existence of config
   */
  active: boolean;
  /**
   * 'default' -> use default template
   * other string -> provide path to custom template
   */
  template: 'default' | string | TemplateFn;
  /**
   * Path to the directory where generated files are stored
   */
  output: string;
  /**
   * Pass info where generated files are imported
   */
  import?: {
    /**
     * Path to file which imports generated file
     */
    filePath: string;
    /**
     * Search phrase
     *
     * This string will be searched inside file provided in `filePath` and its last occurance will be used
     */
    search: string;
    /**
     * Text that will be added the next line after last search occurance
     *
     * When string is passed, the phrases: `{file_name}`, `{module_name}`, `{module_variable_name}` will be replaced as
     *
     * But adding those phrases is **deprecated** and you should use function instead.
     */
    append: string | AppendImportFn;
  };
};

type TemplateFnParams = {
  name: string;
  variableName: string;
  fileName: string;
  className: string;
  subfields: { name: string; variableName: string }[];
};
type TemplateFn = (params: TemplateFnParams) => string;

type AppendImportFnOptions = {
  fileName: string;
  moduleName: string;
  moduleVariableName: string;
};
type AppendImportFn = (variables: AppendImportFnOptions) => string;

export type AcfGeneratorConfig = {
  /**
   * Relative path to acf-json json file which has flexible field
   */
  modulesFilePath: string;
  /**
   * Property name of flexible field
   */
  modulesFieldName: string;
  /**
   *  Decide what to do if file with the same name already exists
   *
   *  @deprecated Use `--overwrite-conflicts` option instead
   */
  conflictAction: 'ignore' | 'overwrite';
  /**
   * List of file types (hardcoded and limited for now) available to generate files
   */
  fileTypes: Record<AvailableFileType, FileType>;
};

export enum AvailableFileType {
  PHP = 'php',
  SCSS = 'scss',
  JS = 'js',
}

export type FileType = {
  active: boolean;
  // 'default' -> use default template
  // path -> provide path to custom template
  template: 'default' | string;
  output: string;
  import?: {
    filePath: string;
    search: string;
    append: string;
  };
};

export type AcfGeneratorConfig = {
  modulesFilePath: string;
  modulesFieldName: string;
  conflictAction: 'ignore' | 'overwrite';
  fileTypes: Record<AvailableFileType, FileType>;
  // fileTypes: { [key in AvailableFileType]: FileType };
};

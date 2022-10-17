import { OperationType } from './cleaner.const.js';

export type BaseOperation = {
  operationType: OperationType;
  groupKey?: string;
  description?: string;
  input: string | string[];
  exclude?: string | string[];
};

// Remove directory operation
export type RemoveDirectoryOperation = BaseOperation & {
  operationType: OperationType.REMOVE_DIRECTORY;
};

export type RemoveFileOperation = BaseOperation & {
  operationType: OperationType.REMOVE_FILE;
};

export type RemoveFromJSONOperation = BaseOperation & {
  operationType: OperationType.REMOVE_FROM_JSON;
  propertyPaths: string | string[];
};

export type RemoveACFLayoutOperation = BaseOperation & {
  operationType: OperationType.REMOVE_ACF_LAYOUT;
  layouts: string | string[];
};

export type RemoveFileLineOperation = BaseOperation & {
  operationType: OperationType.REMOVE_FILE_LINE;
  search: string | string[];
};

export type Operation =
  | RemoveDirectoryOperation
  | RemoveFileLineOperation
  | RemoveFileOperation
  | RemoveFromJSONOperation
  | RemoveACFLayoutOperation;

export type OperationGroup = {
  key: string;
  name: string;
  operations: Operation[];
};

export type CleanerConfig = {
  name?: string;
  description?: string;
  groups: OperationGroup[];
};

import * as z from 'zod';
// import { OperationType } from './cleaner.const.js';

export const OPERATION_TYPE = {
  REMOVE_FILE: 'REMOVE_FILE',
  REMOVE_FILE_LINE: 'REMOVE_FILE_LINE',
  REMOVE_DIRECTORY: 'REMOVE_DIRECTORY',
  REMOVE_FROM_JSON: 'REMOVE_FROM_JSON',
  REMOVE_ACF_LAYOUT: 'REMOVE_ACF_LAYOUT',
} as const;

export type OperationType = (typeof OPERATION_TYPE)[keyof typeof OPERATION_TYPE];

const BaseOperationSchema = z.object({
  /** Describe the operation */
  description: z.string().optional(),
  /** Relative file path or list of files, you can also use glob here */
  input: z.union([z.string(), z.array(z.string())]),
  /** Exclude files from `input` list, useful for excluding files from glob */
  exclude: z.union([z.string(), z.array(z.string())]).optional(),
});

const RemoveFileOperationSchema = z.object({
  /** Type of operation */
  type: z.literal(OPERATION_TYPE.REMOVE_FILE),
  ...BaseOperationSchema.shape,
});

export type RemoveFileOperation = z.infer<typeof RemoveFileOperationSchema>;

const RemoveDirectoryOperationSchema = z.object({
  /** Type of operation */
  type: z.literal(OPERATION_TYPE.REMOVE_DIRECTORY),
  ...BaseOperationSchema.shape,
});

export type RemoveDirectoryOperation = z.infer<typeof RemoveDirectoryOperationSchema>;

const RemoveFromJSONOperationSchema = z.object({
  /** Type of operation */
  type: z.literal(OPERATION_TYPE.REMOVE_FROM_JSON),
  ...BaseOperationSchema.shape,
  /** Remove selected properties using lodash `unset` path, eg. `'a[0].b.c'` */
  propertyPaths: z.union([z.string(), z.array(z.string())]),
});

export type RemoveFromJSONOperation = z.infer<typeof RemoveFromJSONOperationSchema>;

const RemoveACFLayoutOperationSchema = z.object({
  /** Type of operation */
  type: z.literal(OPERATION_TYPE.REMOVE_ACF_LAYOUT),
  ...BaseOperationSchema.shape,
  /** Look for ACF Flexible field layouts and remove them from ACF Local JSON file */
  layouts: z.union([z.string(), z.array(z.string())]),
});

export type RemoveACFLayoutOperation = z.infer<typeof RemoveACFLayoutOperationSchema>;

const RemoveFileLineOperationSchema = z.object({
  /** Type of operation */
  type: z.literal(OPERATION_TYPE.REMOVE_FILE_LINE),
  ...BaseOperationSchema.shape,
  /** Search for specific text and remove line if text was found */
  search: z.union([z.string(), z.array(z.string())]),
});

export type RemoveFileLineOperation = z.infer<typeof RemoveFileLineOperationSchema>;

const operation = z.discriminatedUnion('type', [
  RemoveFileOperationSchema,
  RemoveFileLineOperationSchema,
  RemoveDirectoryOperationSchema,
  RemoveFromJSONOperationSchema,
  RemoveACFLayoutOperationSchema,
]);

export type Operation = z.infer<typeof operation>;

export const cleanerConfigSchema = z.object({
  /** @deprecated There is no need to name cleaner config */
  name: z.string().default(''),
  /** @deprecated You don't have to use description, use comments instead */
  description: z.string().default(''),
  /** */
  groups: z
    .record(
      z.string(),
      z.object({
        /** Group name */
        name: z.string(),
        /** List of operations */
        operations: z.array(operation).default([]),
      })
    )
    .default({}),
});

export type CleanerConfig = z.infer<typeof cleanerConfigSchema>;

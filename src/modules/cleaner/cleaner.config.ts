import { z } from 'zod';
import { OperationType } from './cleaner.const.js';

// Base operation
export const baseOperationSchema = z.object({
  operationType: z.nativeEnum(OperationType),
  groupKey: z.string().optional(),
  description: z.string().optional(),
  input: z.union([z.string(), z.string().array()]),
  exclude: z.union([z.string(), z.string().array()]).optional(),
});
export type BaseOperation = z.infer<typeof baseOperationSchema>;

// Remove directory operation
export const removeDirectoryOperationSchema = baseOperationSchema.and(
  z.object({
    operationType: z.literal(OperationType.REMOVE_DIRECTORY),
  })
);
export type RemoveDirectoryOperation = z.infer<typeof removeDirectoryOperationSchema>;

// Remove file operation
export const removeFileOperationSchema = baseOperationSchema.and(
  z.object({
    operationType: z.literal(OperationType.REMOVE_FILE),
  })
);
export type RemoveFileOperation = z.infer<typeof removeFileOperationSchema>;

// Remove from JSON operation
export const removeFromJSONOperationSchema = baseOperationSchema.and(
  z.object({
    operationType: z.literal(OperationType.REMOVE_FROM_JSON),
    propertyPaths: z.union([z.string(), z.string().array()]),
  })
);

export type RemoveFromJSONOperation = z.infer<typeof removeFromJSONOperationSchema>;

// Remove ACF Layout operation
export const removeACFLayoutOperationSchema = baseOperationSchema.and(
  z.object({
    operationType: z.literal(OperationType.REMOVE_ACF_LAYOUT),
    layouts: z.union([z.string(), z.string().array()]),
  })
);

export type RemoveACFLayoutOperation = z.infer<typeof removeACFLayoutOperationSchema>;

// Remove ACF Layout operation
export const removeFileLineOperationSchema = baseOperationSchema.and(
  z.object({
    operationType: z.literal(OperationType.REMOVE_FILE_LINE),
    search: z.union([z.string(), z.string().array()]),
  })
);

export type RemoveFileLineOperation = z.infer<typeof removeFileLineOperationSchema>;

// Operation
export const OperationSchema = z.union([
  removeDirectoryOperationSchema,
  removeFileLineOperationSchema,
  removeFileOperationSchema,
  removeFromJSONOperationSchema,
  removeACFLayoutOperationSchema,
]);

export type Operation = z.infer<typeof OperationSchema>;

// Operation group
export const OperationGroupSchema = z.object({
  key: z.string(),
  name: z.string(),
  operations: OperationSchema.array(),
});
export type OperationGroup = z.infer<typeof OperationGroupSchema>;

// Cleaner config
export const CleanerConfigSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  groups: OperationGroupSchema.array(),
});

export type CleanerConfig = z.infer<typeof CleanerConfigSchema>;

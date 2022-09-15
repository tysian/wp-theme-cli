export const loggerMergeMessages = (msgs: string[] = [], separator = ' ') =>
  msgs.filter(Boolean).join(separator);

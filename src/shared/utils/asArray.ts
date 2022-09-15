export const asArray = <T = string>(value: T | T[] = []): T[] => ([] as T[]).concat(value ?? []);

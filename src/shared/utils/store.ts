type Store<T> = {
  value: T;
};

export const createStore = <T extends object>(initialValues: T): Store<T> => {
  const ctx = { value: initialValues };

  return ctx;
};

export const getStore = <T extends object>(ctx: Store<T>) => ({ ...ctx.value }) as const;

export const updateStore = <T extends object>(
  ctx: Store<T>,
  property: keyof T,
  val: T[keyof T]
) => {
  if (!(property in ctx.value)) {
    throw new Error(
      `Property ${typeof property === 'string' ? property : ''} doesn't exist in this store`
    );
  }

  ctx.value[property] = val;

  return ctx;
};

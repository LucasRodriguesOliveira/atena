interface CheckRemovedOptions {
  removeFunction: () => Promise<boolean>;
  name: string;
}

export async function removeAndCheck({
  removeFunction,
  name,
}: CheckRemovedOptions) {
  const isRemoved = await removeFunction();

  if (!isRemoved) {
    throw new Error(`Could not remove [${name}]`);
  }
}

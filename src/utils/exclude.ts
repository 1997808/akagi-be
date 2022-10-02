// Exclude keys from user
export function exclude<D, Key extends keyof D>(data: D, ...keys: Key[]): Omit<D, Key> {
  for (const key of keys) {
    delete data[key];
  }
  return data;
}

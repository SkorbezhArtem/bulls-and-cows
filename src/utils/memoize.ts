export const memoize = <Args extends unknown[], Result>(
  fn: (...args: Args) => Result,
): ((...args: Args) => Result) => {
  throw new Error(`memoize is not implemented (${fn.name})`);
};

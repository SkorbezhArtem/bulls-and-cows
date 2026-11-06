export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  throw new Error(
    `generateSecret is not implemented (${length}, ${base}, ${typeof random})`,
  );
};

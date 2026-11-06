import { DIGITS } from './validator.js';

const pickDigits = (
  pool: readonly string[],
  count: number,
  random: () => number,
): string[] => {
  if (count === 0) {
    return [];
  }

  const index = Math.floor(random() * pool.length);
  const rest = pool.filter((_, poolIndex) => poolIndex !== index);

  return [pool[index], ...pickDigits(rest, count - 1, random)];
};

export const generateSecret = (
  length: number,
  base: number,
  random: () => number = Math.random,
): string => {
  if (length > base) {
    throw new RangeError(`Cannot pick ${length} unique digits in base ${base}`);
  }

  return pickDigits([...DIGITS.slice(0, base)], length, random).join('');
};

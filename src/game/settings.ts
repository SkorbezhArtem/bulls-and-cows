import type { GameSettings } from './state.js';

export const MIN_LENGTH = 2;
export const MAX_LENGTH = 6;

const ALL_LENGTHS: readonly number[] = Array.from(
  { length: MAX_LENGTH - MIN_LENGTH + 1 },
  (_, index) => MIN_LENGTH + index,
);

export const getAvailableLengths = (base: number): number[] =>
  ALL_LENGTHS.filter((length) => length <= base);

export const withBase = (
  settings: GameSettings,
  base: number,
): GameSettings => {
  const lengths = getAvailableLengths(base);
  const length = lengths.includes(settings.length)
    ? settings.length
    : (lengths[0] ?? settings.length);

  return { length, base };
};

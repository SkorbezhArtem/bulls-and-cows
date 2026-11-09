import { describe, expect, it } from 'vitest';
import { countPossibleSecrets } from './count.js';

describe('countPossibleSecrets', () => {
  it.each([
    [2, 2, 2],
    [2, 8, 56],
    [3, 8, 336],
    [4, 8, 1680],
    [5, 8, 6720],
    [6, 8, 20160],
    [2, 10, 90],
    [3, 10, 720],
    [4, 10, 5040],
    [5, 10, 30240],
    [6, 10, 151200],
    [2, 16, 240],
    [3, 16, 3360],
    [4, 16, 43680],
    [5, 16, 524160],
    [6, 16, 5765760],
  ])('counts %i unique digits in base %i as %i', (length, base, expected) => {
    expect(countPossibleSecrets(length, base)).toBe(expected);
  });

  it.each([
    [1, 1, 1],
    [3, 3, 6],
    [5, 5, 120],
    [8, 8, 40320],
  ])(
    'counts all permutations when length %i equals base %i',
    (length, base, expected) => {
      expect(countPossibleSecrets(length, base)).toBe(expected);
    },
  );

  it.each([2, 8, 10, 16])('counts a single digit as %i in base %i', (base) => {
    expect(countPossibleSecrets(1, base)).toBe(base);
  });

  it('counts exactly one empty secret', () => {
    expect(countPossibleSecrets(0, 10)).toBe(1);
  });

  it('returns 0 when length is bigger than the base', () => {
    expect(countPossibleSecrets(3, 2)).toBe(0);
    expect(countPossibleSecrets(11, 10)).toBe(0);
    expect(countPossibleSecrets(17, 16)).toBe(0);
  });

  it('follows the recurrence f(l, b) = b * f(l - 1, b - 1)', () => {
    expect(countPossibleSecrets(4, 10)).toBe(10 * countPossibleSecrets(3, 9));
    expect(countPossibleSecrets(6, 16)).toBe(16 * countPossibleSecrets(5, 15));
    expect(countPossibleSecrets(2, 2)).toBe(2 * countPossibleSecrets(1, 1));
  });

  it('returns the same result when called repeatedly', () => {
    const first = countPossibleSecrets(4, 10);

    countPossibleSecrets(5, 16);

    expect(countPossibleSecrets(4, 10)).toBe(first);
    expect(first).toBe(5040);
  });

  it('does not mix up results of different arguments', () => {
    expect(countPossibleSecrets(1, 12)).toBe(12);
    expect(countPossibleSecrets(11, 2)).toBe(0);
    expect(countPossibleSecrets(2, 10)).toBe(90);
    expect(countPossibleSecrets(2, 16)).toBe(240);
  });
});

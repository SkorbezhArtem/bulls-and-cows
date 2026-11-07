import { describe, expect, it } from 'vitest';
import { getAvailableLengths } from './settings.js';

describe('getAvailableLengths', () => {
  it('allows only length 2 for the binary base', () => {
    expect(getAvailableLengths(2)).toEqual([2]);
  });

  it.each([8, 10, 16])('allows lengths 2-6 for base %i', (base) => {
    expect(getAvailableLengths(base)).toEqual([2, 3, 4, 5, 6]);
  });

  it.each([
    [3, [2, 3]],
    [4, [2, 3, 4]],
  ])('does not offer lengths above the base %i', (base, expected) => {
    expect(getAvailableLengths(base)).toEqual(expected);
  });

  it.each([1, 0])('offers nothing for the base %i', (base) => {
    expect(getAvailableLengths(base)).toEqual([]);
  });

  it('returns a new array on every call', () => {
    const first = getAvailableLengths(10);
    first.push(99);

    expect(getAvailableLengths(10)).toEqual([2, 3, 4, 5, 6]);
  });
});

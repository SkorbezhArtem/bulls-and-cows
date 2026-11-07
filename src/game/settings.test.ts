import { describe, expect, it } from 'vitest';
import { getAvailableLengths, withBase } from './settings.js';

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

describe('withBase', () => {
  it('keeps the length when it is available in the new base', () => {
    expect(withBase({ length: 4, base: 10 }, 16)).toEqual({
      length: 4,
      base: 16,
    });
  });

  it('switches to length 2 when the new base is binary', () => {
    expect(withBase({ length: 5, base: 10 }, 2)).toEqual({
      length: 2,
      base: 2,
    });
  });

  it('keeps length 2 when the base changes from binary', () => {
    expect(withBase({ length: 2, base: 2 }, 10)).toEqual({
      length: 2,
      base: 10,
    });
  });

  it.each([2, 3, 4, 5, 6])('keeps length %i in hex', (length) => {
    expect(withBase({ length, base: 10 }, 16)).toEqual({ length, base: 16 });
  });

  it('returns new settings and does not change the old ones', () => {
    const settings = Object.freeze({ length: 5, base: 10 });

    const next = withBase(settings, 2);

    expect(next).not.toBe(settings);
    expect(settings).toEqual({ length: 5, base: 10 });
  });
});

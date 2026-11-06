import { describe, expect, it } from 'vitest';
import { generateSecret } from './secret.js';

const ALPHABET = '0123456789abcdef';

const always = (value: number) => () => value;

const cycle = (values: number[]): (() => number) => {
  let index = 0;
  return () => values[index++ % values.length];
};

describe('generateSecret', () => {
  it('takes the first free digit each time and keeps a leading zero', () => {
    expect(generateSecret(4, 10, always(0))).toBe('0123');
  });

  it('takes the last free digit each time when random is close to 1', () => {
    expect(generateSecret(4, 10, always(0.999))).toBe('9876');
  });

  it('picks every digit from the digits that are still free', () => {
    expect(generateSecret(3, 10, cycle([0.5, 0, 0.25]))).toBe('503');
  });

  it('uses lowercase letters for hex', () => {
    expect(generateSecret(6, 16, always(0.999))).toBe('fedcba');
  });

  it('uses only digits 0-7 for octal', () => {
    expect(generateSecret(4, 8, always(0.999))).toBe('7654');
  });

  it('builds both possible binary secrets of length 2', () => {
    expect(generateSecret(2, 2, always(0))).toBe('01');
    expect(generateSecret(2, 2, always(0.999))).toBe('10');
  });

  it('returns the same secret for the same random values', () => {
    const values = [0.3, 0.7, 0.1, 0.9];

    expect(generateSecret(4, 16, cycle(values))).toBe(
      generateSecret(4, 16, cycle(values)),
    );
  });

  it.each([
    [2, 2],
    [8, 5],
    [10, 4],
    [10, 6],
    [16, 6],
    [16, 16],
  ])('generates a valid secret for base %i and length %i', (base, length) => {
    const secret = generateSecret(
      length,
      base,
      cycle([0.13, 0.87, 0.42, 0.66, 0.05, 0.99]),
    );
    const allowed = ALPHABET.slice(0, base);

    expect(secret).toHaveLength(length);
    expect(new Set(secret).size).toBe(length);
    expect([...secret].every((char) => allowed.includes(char))).toBe(true);
  });

  it('works without a custom random source', () => {
    const secret = generateSecret(4, 10);

    expect(secret).toHaveLength(4);
    expect(new Set(secret).size).toBe(4);
  });

  it('throws when length is bigger than the number of digits in the base', () => {
    expect(() => generateSecret(3, 2, always(0))).toThrow(RangeError);
  });
});

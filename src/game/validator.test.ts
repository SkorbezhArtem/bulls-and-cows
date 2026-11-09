import { describe, expect, it } from 'vitest';
import { createDigitValidator, isValidGuess } from './validator.js';

describe('createDigitValidator', () => {
  it('accepts only 0 and 1 for binary', () => {
    const isDigit = createDigitValidator(2);

    expect(isDigit('0')).toBe(true);
    expect(isDigit('1')).toBe(true);
    expect(isDigit('2')).toBe(false);
  });

  it('accepts digits 0-7 for octal', () => {
    const isDigit = createDigitValidator(8);

    expect(isDigit('0')).toBe(true);
    expect(isDigit('7')).toBe(true);
    expect(isDigit('8')).toBe(false);
    expect(isDigit('9')).toBe(false);
  });

  it('accepts digits 0-9 for decimal and rejects letters', () => {
    const isDigit = createDigitValidator(10);

    expect(isDigit('0')).toBe(true);
    expect(isDigit('9')).toBe(true);
    expect(isDigit('a')).toBe(false);
  });

  it('accepts digits 0-9 and letters a-f for hex', () => {
    const isDigit = createDigitValidator(16);

    expect(isDigit('0')).toBe(true);
    expect(isDigit('9')).toBe(true);
    expect(isDigit('a')).toBe(true);
    expect(isDigit('f')).toBe(true);
    expect(isDigit('g')).toBe(false);
  });

  it('treats uppercase hex letters the same as lowercase', () => {
    const isDigit = createDigitValidator(16);

    expect(isDigit('A')).toBe(true);
    expect(isDigit('F')).toBe(true);
    expect(isDigit('G')).toBe(false);
  });

  it('rejects empty string and multi-character input', () => {
    const isDigit = createDigitValidator(16);

    expect(isDigit('')).toBe(false);
    expect(isDigit('ab')).toBe(false);
    expect(isDigit('10')).toBe(false);
  });

  it('rejects whitespace and symbols', () => {
    const isDigit = createDigitValidator(10);

    expect(isDigit(' ')).toBe(false);
    expect(isDigit('-')).toBe(false);
    expect(isDigit('.')).toBe(false);
  });

  it('returns independent validators for different bases', () => {
    const isBinary = createDigitValidator(2);
    const isDecimal = createDigitValidator(10);

    expect(isBinary('5')).toBe(false);
    expect(isDecimal('5')).toBe(true);
  });
});

describe('isValidGuess', () => {
  it('accepts a valid decimal guess', () => {
    expect(isValidGuess('1234', 4, 10)).toBe(true);
  });

  it('accepts a guess with a leading zero', () => {
    expect(isValidGuess('0123', 4, 10)).toBe(true);
  });

  it('rejects a guess of the wrong length', () => {
    expect(isValidGuess('123', 4, 10)).toBe(false);
    expect(isValidGuess('12345', 4, 10)).toBe(false);
  });

  it('rejects an empty guess', () => {
    expect(isValidGuess('', 4, 10)).toBe(false);
  });

  it('rejects characters that are not digits of the base', () => {
    expect(isValidGuess('12a4', 4, 10)).toBe(false);
    expect(isValidGuess('02', 2, 2)).toBe(false);
  });

  it('rejects repeated digits', () => {
    expect(isValidGuess('1123', 4, 10)).toBe(false);
    expect(isValidGuess('1231', 4, 10)).toBe(false);
  });

  it('accepts uppercase and lowercase hex digits', () => {
    expect(isValidGuess('a1f3', 4, 16)).toBe(true);
    expect(isValidGuess('A1F3', 4, 16)).toBe(true);
  });

  it('treats hex digits that differ only by case as repeated', () => {
    expect(isValidGuess('aA12', 4, 16)).toBe(false);
  });

  it('rejects spaces and symbols', () => {
    expect(isValidGuess('12 4', 4, 10)).toBe(false);
    expect(isValidGuess('-123', 4, 10)).toBe(false);
  });

  it('allows only length 2 without repeats for the binary base', () => {
    expect(isValidGuess('01', 2, 2)).toBe(true);
    expect(isValidGuess('10', 2, 2)).toBe(true);
    expect(isValidGuess('00', 2, 2)).toBe(false);
    expect(isValidGuess('011', 2, 2)).toBe(false);
  });
});

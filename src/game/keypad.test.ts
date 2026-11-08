import { describe, expect, it } from 'vitest';
import {
  appendDigit,
  deleteLastDigit,
  getKeypadKeys,
  type KeypadKey,
} from './keypad.js';

const digitsOf = (keys: KeypadKey[]): string =>
  keys.map((key) => key.digit).join('');

const disabledOf = (keys: KeypadKey[]): string[] =>
  keys.filter((key) => key.disabled).map((key) => key.digit);

describe('getKeypadKeys', () => {
  it('has only 0 and 1 for the binary base', () => {
    expect(digitsOf(getKeypadKeys(2, '', 2))).toBe('01');
  });

  it('has digits 0-9 in order for the decimal base', () => {
    expect(digitsOf(getKeypadKeys(10, '', 4))).toBe('0123456789');
  });

  it('has digits 0-9 and lowercase a-f for the hex base', () => {
    expect(digitsOf(getKeypadKeys(16, '', 4))).toBe('0123456789abcdef');
  });

  it('keeps every key enabled while the draft is empty', () => {
    expect(disabledOf(getKeypadKeys(10, '', 4))).toEqual([]);
  });

  it('disables the digits that are already in the draft', () => {
    expect(disabledOf(getKeypadKeys(10, '12', 4))).toEqual(['1', '2']);
  });

  it('ignores the case of hex digits in the draft', () => {
    expect(disabledOf(getKeypadKeys(16, 'A1', 4))).toEqual(['1', 'a']);
  });

  it('disables every key when the draft is full', () => {
    const keys = getKeypadKeys(10, '12', 2);

    expect(keys.every((key) => key.disabled)).toBe(true);
  });

  it('returns a new list on every call', () => {
    const first = getKeypadKeys(2, '', 2);
    first.pop();

    expect(getKeypadKeys(2, '', 2)).toHaveLength(2);
  });
});

describe('appendDigit', () => {
  it('adds a digit to an empty draft', () => {
    expect(appendDigit('', '5', 4, 10)).toBe('5');
  });

  it('adds digits in the order they were pressed', () => {
    expect(appendDigit('12', '3', 4, 10)).toBe('123');
  });

  it('allows zero as the first digit', () => {
    expect(appendDigit('', '0', 4, 10)).toBe('0');
  });

  it('ignores a digit that is already in the draft', () => {
    expect(appendDigit('12', '2', 4, 10)).toBe('12');
  });

  it('ignores a digit when the draft is full', () => {
    expect(appendDigit('1234', '5', 4, 10)).toBe('1234');
  });

  it('ignores a digit that does not belong to the base', () => {
    expect(appendDigit('1', '2', 2, 2)).toBe('1');
    expect(appendDigit('1', 'a', 4, 10)).toBe('1');
  });

  it('stores a hex digit in lowercase', () => {
    expect(appendDigit('1', 'A', 4, 16)).toBe('1a');
  });

  it('ignores a hex digit that differs only by case from a used one', () => {
    expect(appendDigit('1A', 'a', 4, 16)).toBe('1A');
  });

  it('ignores an empty or multi-character value', () => {
    expect(appendDigit('1', '', 4, 16)).toBe('1');
    expect(appendDigit('1', 'ab', 4, 16)).toBe('1');
  });
});

describe('deleteLastDigit', () => {
  it('removes the last digit', () => {
    expect(deleteLastDigit('123')).toBe('12');
  });

  it('leaves an empty draft after removing the only digit', () => {
    expect(deleteLastDigit('7')).toBe('');
  });

  it('keeps an empty draft empty', () => {
    expect(deleteLastDigit('')).toBe('');
  });
});

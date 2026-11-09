import { createDigitValidator, DIGITS } from './validator.js';

export type KeypadKey = { digit: string; disabled: boolean };

export const getKeypadKeys = (
  base: number,
  draft: string,
  length: number,
): KeypadKey[] => {
  const used = new Set([...draft.toLowerCase()]);
  const full = draft.length >= length;

  return [...DIGITS.slice(0, base)].map((digit) => ({
    digit,
    disabled: full || used.has(digit),
  }));
};

export const appendDigit = (
  draft: string,
  digit: string,
  length: number,
  base: number,
): string => {
  const normalized = digit.toLowerCase();
  const canAppend =
    createDigitValidator(base)(normalized) &&
    draft.length < length &&
    !draft.toLowerCase().includes(normalized);

  return canAppend ? draft + normalized : draft;
};

export const deleteLastDigit = (draft: string): string => draft.slice(0, -1);

export const sanitizeDraft = (
  raw: string,
  length: number,
  base: number,
): string =>
  [...raw].reduce((draft, char) => appendDigit(draft, char, length, base), '');

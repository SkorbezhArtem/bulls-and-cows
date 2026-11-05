export const DIGITS = '0123456789abcdef';

export const createDigitValidator = (base: number) => {
  const alphabet = DIGITS.slice(0, base);

  return (char: string): boolean =>
    char.length === 1 && alphabet.includes(char.toLowerCase());
};

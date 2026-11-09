export const DIGITS = '0123456789abcdef';

export const createDigitValidator = (base: number) => {
  const alphabet = DIGITS.slice(0, base);

  return (char: string): boolean =>
    char.length === 1 && alphabet.includes(char.toLowerCase());
};

export const isValidGuess = (
  guess: string,
  length: number,
  base: number,
): boolean => {
  const isDigit = createDigitValidator(base);
  const chars = guess.split('').map((char) => char.toLowerCase());

  return (
    chars.length === length &&
    chars.every(isDigit) &&
    new Set(chars).size === chars.length
  );
};

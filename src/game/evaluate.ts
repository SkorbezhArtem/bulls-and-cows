export type GuessResult = { bulls: number; cows: number };

const toDigits = (value: string): string[] => [...value.toLowerCase()];

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  const secretDigits = toDigits(secret);
  const guessDigits = toDigits(guess);
  const secretSet = new Set(secretDigits);

  const bulls = guessDigits.filter(
    (digit, index) => digit === secretDigits[index],
  ).length;
  const common = guessDigits.filter((digit) => secretSet.has(digit)).length;

  return { bulls, cows: common - bulls };
};

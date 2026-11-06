export type GuessResult = { bulls: number; cows: number };

export const evaluateGuess = (secret: string, guess: string): GuessResult => {
  throw new Error(`evaluateGuess is not implemented (${secret}, ${guess})`);
};

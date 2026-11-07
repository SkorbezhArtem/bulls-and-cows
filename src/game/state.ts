export type GameSettings = { length: number; base: number };

export type Attempt = { guess: string; bulls: number; cows: number };

export type GameState = {
  settings: GameSettings;
  secret: string;
  status: 'playing' | 'won';
  history: readonly Attempt[];
  startedAt: number;
  finishedAt: number | null;
};

export const createGame = (
  settings: GameSettings,
  secret: string,
  now: number,
): GameState => {
  throw new Error(
    `createGame is not implemented (${JSON.stringify(settings)}, ${secret}, ${now})`,
  );
};

export const submitGuess = (
  state: GameState,
  guess: string,
  now: number,
): GameState => {
  throw new Error(
    `submitGuess is not implemented (${state.status}, ${guess}, ${now})`,
  );
};

export const isRepeatedGuess = (state: GameState, guess: string): boolean => {
  throw new Error(
    `isRepeatedGuess is not implemented (${state.status}, ${guess})`,
  );
};

export const getElapsedMs = (state: GameState, now: number): number => {
  throw new Error(`getElapsedMs is not implemented (${state.status}, ${now})`);
};

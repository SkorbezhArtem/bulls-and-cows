import { evaluateGuess } from './evaluate.js';
import { isValidGuess } from './validator.js';

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
): GameState => ({
  settings,
  secret,
  status: 'playing',
  history: [],
  startedAt: now,
  finishedAt: null,
});

export const isRepeatedGuess = (state: GameState, guess: string): boolean =>
  state.history.some((attempt) => attempt.guess === guess.toLowerCase());

export const submitGuess = (
  state: GameState,
  guess: string,
  now: number,
): GameState => {
  const { length, base } = state.settings;
  const normalized = guess.toLowerCase();

  if (
    state.status !== 'playing' ||
    !isValidGuess(normalized, length, base) ||
    isRepeatedGuess(state, normalized)
  ) {
    return state;
  }

  const { bulls, cows } = evaluateGuess(state.secret, normalized);
  const won = bulls === length;

  return {
    ...state,
    status: won ? 'won' : 'playing',
    history: [...state.history, { guess: normalized, bulls, cows }],
    finishedAt: won ? now : null,
  };
};

export const getElapsedMs = (state: GameState, now: number): number =>
  (state.finishedAt ?? now) - state.startedAt;

import { describe, expect, it } from 'vitest';
import {
  createGame,
  getElapsedMs,
  isRepeatedGuess,
  submitGuess,
  type GameState,
} from './state.js';

const settings = { length: 4, base: 10 };
const hexSettings = { length: 4, base: 16 };

const start = (): GameState => createGame(settings, '1234', 1000);

const freeze = (state: GameState): GameState =>
  Object.freeze({
    ...state,
    settings: Object.freeze({ ...state.settings }),
    history: Object.freeze(
      state.history.map((attempt) => Object.freeze({ ...attempt })),
    ),
  });

describe('createGame', () => {
  it('starts a round with the given settings and secret', () => {
    expect(createGame(settings, '1234', 1000)).toEqual({
      settings: { length: 4, base: 10 },
      secret: '1234',
      status: 'playing',
      history: [],
      startedAt: 1000,
      finishedAt: null,
    });
  });
});

describe('submitGuess', () => {
  it('adds an attempt with bulls and cows to the history', () => {
    const next = submitGuess(start(), '1243', 2000);

    expect(next.history).toEqual([{ guess: '1243', bulls: 2, cows: 2 }]);
  });

  it('keeps playing after a wrong guess', () => {
    const next = submitGuess(start(), '1243', 2000);

    expect(next.status).toBe('playing');
    expect(next.finishedAt).toBeNull();
  });

  it('does not mutate the previous state', () => {
    const state = freeze(start());

    const next = submitGuess(state, '1243', 2000);

    expect(next).not.toBe(state);
    expect(next.history).not.toBe(state.history);
    expect(state.history).toHaveLength(0);
    expect(state.status).toBe('playing');
  });

  it('keeps earlier attempts untouched and in order', () => {
    const first = submitGuess(start(), '1243', 2000);
    const second = submitGuess(first, '5678', 3000);

    expect(first.history).toHaveLength(1);
    expect(second.history).toHaveLength(2);
    expect(second.history[0]).toBe(first.history[0]);
    expect(second.history[1]).toEqual({ guess: '5678', bulls: 0, cows: 0 });
  });

  it('keeps settings, secret and start time', () => {
    const next = submitGuess(start(), '1243', 2000);

    expect(next).toMatchObject({
      settings: { length: 4, base: 10 },
      secret: '1234',
      startedAt: 1000,
    });
  });

  it('wins when every digit is a bull and stores the finish time', () => {
    const next = submitGuess(start(), '1234', 5000);

    expect(next.status).toBe('won');
    expect(next.finishedAt).toBe(5000);
    expect(next.history).toEqual([{ guess: '1234', bulls: 4, cows: 0 }]);
  });

  it('stores hex guesses in lowercase and wins regardless of case', () => {
    const state = createGame(hexSettings, 'a1f3', 0);

    const next = submitGuess(state, 'A1F3', 4000);

    expect(next.history[0].guess).toBe('a1f3');
    expect(next.status).toBe('won');
  });

  it('ignores a repeated guess', () => {
    const first = submitGuess(start(), '1243', 2000);

    expect(submitGuess(first, '1243', 3000)).toBe(first);
  });

  it('ignores a repeated hex guess that differs only by case', () => {
    const state = createGame(hexSettings, 'a1f3', 0);
    const first = submitGuess(state, 'b2e4', 1000);

    expect(submitGuess(first, 'B2E4', 2000)).toBe(first);
  });

  it.each(['123', '12345', '12a4', '1123', '', ' 123'])(
    'ignores the invalid guess %j',
    (guess) => {
      const state = start();

      expect(submitGuess(state, guess, 2000)).toBe(state);
    },
  );

  it('ignores guesses after the round is won', () => {
    const won = submitGuess(start(), '1234', 2000);

    expect(submitGuess(won, '5678', 3000)).toBe(won);
  });
});

describe('isRepeatedGuess', () => {
  it('returns false before any attempts', () => {
    expect(isRepeatedGuess(start(), '1243')).toBe(false);
  });

  it('returns true only for a guess that is already in the history', () => {
    const state = submitGuess(start(), '1243', 2000);

    expect(isRepeatedGuess(state, '1243')).toBe(true);
    expect(isRepeatedGuess(state, '5678')).toBe(false);
  });

  it('ignores the case of hex digits', () => {
    const state = submitGuess(createGame(hexSettings, 'a1f3', 0), 'b2e4', 1000);

    expect(isRepeatedGuess(state, 'B2E4')).toBe(true);
  });
});

describe('getElapsedMs', () => {
  it('measures the time since the start while playing', () => {
    expect(getElapsedMs(start(), 4500)).toBe(3500);
  });

  it('stops the clock when the round is won', () => {
    const won = submitGuess(start(), '1234', 5000);

    expect(getElapsedMs(won, 99999)).toBe(4000);
  });
});

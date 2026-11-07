import { generateSecret } from './game/secret.js';
import { createGame, isRepeatedGuess, submitGuess } from './game/state.js';
import type { GameSettings, GameState } from './game/state.js';
import { isValidGuess } from './game/validator.js';
import { h } from './ui/dom.js';
import { renderGame } from './ui/game-view.js';
import { renderSettings } from './ui/settings-view.js';

type AppState = {
  settings: GameSettings;
  game: GameState | null;
  draft: string;
  message: string | null;
};

let state: AppState = {
  settings: { length: 4, base: 10 },
  game: null,
  draft: '',
  message: null,
};

const app = h('main', { id: 'app' });
document.body.append(app);

const setSettings = (settings: GameSettings): void => {
  state = { ...state, settings };
  render();
};

const startGame = (): void => {
  const { length, base } = state.settings;

  state = {
    ...state,
    game: createGame(state.settings, generateSecret(length, base), Date.now()),
    draft: '',
    message: null,
  };
  render();
};

const setDraft = (draft: string): void => {
  state = { ...state, draft, message: null };
};

const showMessage = (message: string): void => {
  state = { ...state, message };
  render();
};

const sendGuess = (): void => {
  const { game, draft } = state;

  if (!game || game.status !== 'playing') {
    return;
  }

  const { length, base } = game.settings;

  if (!isValidGuess(draft, length, base)) {
    showMessage(`Enter ${length} different digits`);
    return;
  }

  if (isRepeatedGuess(game, draft)) {
    showMessage('You already tried this number');
    return;
  }

  state = {
    ...state,
    game: submitGuess(game, draft, Date.now()),
    draft: '',
    message: null,
  };
  render();
};

const render = (): void => {
  const focusedId = document.activeElement?.id;
  const { game, draft, message } = state;

  app.replaceChildren(
    h('h1', {}, 'Bulls and Cows'),
    renderSettings({
      settings: state.settings,
      locked: game !== null,
      onChange: setSettings,
      onStart: startGame,
    }),
    ...(game
      ? [
          renderGame({
            game,
            draft,
            message,
            onDraftChange: setDraft,
            onSubmit: sendGuess,
          }),
        ]
      : []),
  );

  const focusId = game?.status === 'playing' ? 'guess' : focusedId;

  if (focusId) {
    document.getElementById(focusId)?.focus();
  }
};

render();

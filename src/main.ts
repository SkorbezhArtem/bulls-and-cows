import { addRecord, createRecord } from './game/records.js';
import type { GameRecord } from './game/records.js';
import { generateSecret } from './game/secret.js';
import { createGame, isRepeatedGuess, submitGuess } from './game/state.js';
import type { GameSettings, GameState } from './game/state.js';
import { isValidGuess } from './game/validator.js';
import {
  loadRecords,
  loadTheme,
  saveRecords,
  saveTheme,
} from './services/storage.js';
import type { Theme } from './utils/theme.js';
import { h } from './ui/dom.js';
import { renderGame } from './ui/game-view.js';
import { renderRecords } from './ui/records-view.js';
import { renderSettings } from './ui/settings-view.js';
import { applyTheme, renderThemeSwitcher } from './ui/theme-view.js';

type AppState = {
  settings: GameSettings;
  game: GameState | null;
  draft: string;
  message: string | null;
  records: GameRecord[];
  theme: Theme;
};

const initialTheme = loadTheme();
applyTheme(initialTheme);

let state: AppState = {
  settings: { length: 4, base: 10 },
  game: null,
  draft: '',
  message: null,
  records: loadRecords(),
  theme: initialTheme,
};

const app = h('main', { id: 'app' });
document.body.append(app);

const setTheme = (theme: Theme): void => {
  const update = (): void => {
    applyTheme(theme);
    saveTheme(theme);
    state = { ...state, theme };
    render();
  };

  const reducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  if (reducedMotion || !('startViewTransition' in document)) {
    update();
    return;
  }

  document.startViewTransition(update);
};

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

const newGame = (): void => {
  state = { ...state, game: null, draft: '', message: null };
  render();
  document.getElementById('start')?.focus();
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

  const next = submitGuess(game, draft, Date.now());
  const finished = createRecord(next);
  const records = finished ? addRecord(state.records, finished) : state.records;

  if (finished) {
    saveRecords(records);
  }

  state = { ...state, game: next, draft: '', message: null, records };
  render();
};

const pickFocusId = (
  focusedId: string | undefined,
  game: GameState | null,
): string | undefined => {
  if (focusedId?.startsWith('theme-')) {
    return focusedId;
  }

  if (!game) {
    return focusedId;
  }

  return game.status === 'playing' ? 'guess' : 'new-game';
};

const render = (): void => {
  const focusedId = document.activeElement?.id;
  const { game, draft, message, records, settings, theme } = state;

  app.replaceChildren(
    h(
      'header',
      { class: 'app-header' },
      h('h1', {}, 'Bulls and Cows'),
      renderThemeSwitcher({ theme, onChange: setTheme }),
    ),
    renderSettings({
      settings,
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
            onNewGame: newGame,
          }),
        ]
      : []),
    renderRecords({ records, settings }),
  );

  const focusId = pickFocusId(focusedId, game);
  const target = focusId ? document.getElementById(focusId) : null;

  target?.focus();

  if (target instanceof HTMLInputElement) {
    const end = target.value.length;
    target.setSelectionRange(end, end);
  }
};

render();

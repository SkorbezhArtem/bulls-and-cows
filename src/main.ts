import { generateSecret } from './game/secret.js';
import { createGame } from './game/state.js';
import type { GameSettings, GameState } from './game/state.js';
import { renderGame } from './ui/game-view.js';
import { h } from './ui/dom.js';
import { renderSettings } from './ui/settings-view.js';

type AppState = { settings: GameSettings; game: GameState | null };

let state: AppState = { settings: { length: 4, base: 10 }, game: null };

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
  };
  render();
};

const render = (): void => {
  const focusedId = document.activeElement?.id;

  app.replaceChildren(
    h('h1', {}, 'Bulls and Cows'),
    renderSettings({
      settings: state.settings,
      locked: state.game !== null,
      onChange: setSettings,
      onStart: startGame,
    }),
    ...(state.game ? [renderGame(state.game)] : []),
  );

  if (focusedId) {
    document.getElementById(focusedId)?.focus();
  }
};

render();

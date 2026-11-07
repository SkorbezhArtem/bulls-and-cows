import type { GameSettings } from './game/state.js';
import { h } from './ui/dom.js';
import { renderSettings } from './ui/settings-view.js';

type AppState = { settings: GameSettings };

let state: AppState = { settings: { length: 4, base: 10 } };

const app = h('main', { id: 'app' });
document.body.append(app);

const setSettings = (settings: GameSettings): void => {
  state = { ...state, settings };
  render();
};

const render = (): void => {
  const focusedId = document.activeElement?.id;

  app.replaceChildren(
    h('h1', {}, 'Bulls and Cows'),
    renderSettings({ settings: state.settings, onChange: setSettings }),
  );

  if (focusedId) {
    document.getElementById(focusedId)?.focus();
  }
};

render();

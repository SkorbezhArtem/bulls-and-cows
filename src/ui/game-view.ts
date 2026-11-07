import type { GameState } from '../game/state.js';
import { h } from './dom.js';

export const renderGame = (game: GameState): HTMLElement =>
  h(
    'section',
    { class: 'game' },
    h('h2', {}, 'Round in progress'),
    h(
      'p',
      {},
      `Guess the secret: ${game.settings.length} unique digits, base ${game.settings.base}.`,
    ),
  );

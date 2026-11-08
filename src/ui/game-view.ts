import { appendDigit, deleteLastDigit } from '../game/keypad.js';
import { getElapsedMs, type GameState } from '../game/state.js';
import { createDigitValidator } from '../game/validator.js';
import { renderAttempt } from './attempt-view.js';
import { h } from './dom.js';
import { formatDuration } from './format.js';
import { renderKeypad } from './keypad-view.js';

type GameViewProps = {
  game: GameState;
  draft: string;
  message: string | null;
  onDraftChange: (draft: string) => void;
  onSubmit: () => void;
  onNewGame: () => void;
};

export const renderGame = ({
  game,
  draft,
  message,
  onDraftChange,
  onSubmit,
  onNewGame,
}: GameViewProps): HTMLElement => {
  const { length, base } = game.settings;
  const isDigit = createDigitValidator(base);
  const playing = game.status === 'playing';

  const messageElement = h('p', { class: 'message', role: 'alert' }, message);

  const keypad = renderKeypad({
    base,
    length,
    draft,
    onDigit: (digit) =>
      applyDraft(appendDigit(input.value, digit, length, base)),
    onDelete: () => applyDraft(deleteLastDigit(input.value)),
  });

  const input = h('input', {
    id: 'guess',
    type: 'text',
    value: draft,
    maxlength: length,
    inputmode: 'none',
    autocomplete: 'off',
    autocapitalize: 'off',
    spellcheck: 'false',
    disabled: !playing,
    'aria-label': `Your guess, ${length} digits`,
    onInput: (event) => {
      const field = event.target as HTMLInputElement;
      const clean = [...field.value.toLowerCase()]
        .filter(isDigit)
        .slice(0, length)
        .join('');

      applyDraft(clean);
    },
  });

  const applyDraft = (next: string): void => {
    input.value = next;
    messageElement.textContent = '';
    keypad.update(next);
    onDraftChange(next);
  };

  const result = playing
    ? null
    : h(
        'div',
        { class: 'result', role: 'status' },
        h('h3', {}, 'You won!'),
        h('p', {}, `The secret was ${game.secret}.`),
        h('p', {}, `Attempts: ${game.history.length}`),
        h('p', {}, `Time: ${formatDuration(getElapsedMs(game, Date.now()))}`),
      );

  return h(
    'section',
    { class: 'game' },
    h('h2', {}, 'Your guess'),
    h('p', {}, `Enter ${length} different digits (base ${base}).`),
    h(
      'form',
      {
        class: 'guess-form',
        onSubmit: (event) => {
          event.preventDefault();
          onSubmit();
        },
      },
      input,
      h('button', { type: 'submit', disabled: !playing }, 'Guess'),
    ),
    messageElement,
    playing ? keypad.element : null,
    result,
    h(
      'button',
      { type: 'button', id: 'new-game', onClick: onNewGame },
      'New game',
    ),
    h('h3', {}, `History (${game.history.length})`),
    h('ol', { class: 'history' }, ...game.history.map(renderAttempt)),
  );
};

import { appendDigit, deleteLastDigit, sanitizeDraft } from '../game/keypad.js';
import { getElapsedMs, type GameState } from '../game/state.js';
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

const renderLegend = (): HTMLElement =>
  h(
    'div',
    { class: 'legend' },
    h(
      'span',
      { class: 'legend-item' },
      h('span', { class: 'peg peg-bull', 'aria-hidden': 'true' }),
      'Bull: right digit, right place',
    ),
    h(
      'span',
      { class: 'legend-item' },
      h('span', { class: 'peg peg-cow', 'aria-hidden': 'true' }),
      'Cow: right digit, wrong place',
    ),
  );

export const renderGame = ({
  game,
  draft,
  message,
  onDraftChange,
  onSubmit,
  onNewGame,
}: GameViewProps): HTMLElement => {
  const { length, base } = game.settings;
  const playing = game.status === 'playing';
  const hasAttempts = game.history.length > 0;

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
      applyDraft(sanitizeDraft(field.value, length, base));
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
        h(
          'button',
          { type: 'button', id: 'new-game', onClick: onNewGame },
          'New game',
        ),
      );

  return h(
    'section',
    { class: 'game' },
    h(
      'div',
      { class: 'game-head' },
      h('h2', {}, 'Your guess'),
      playing
        ? h(
            'button',
            {
              type: 'button',
              id: 'new-game',
              class: 'btn-ghost',
              onClick: onNewGame,
            },
            'New game',
          )
        : null,
    ),
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
    h('h3', {}, `History (${game.history.length})`),
    hasAttempts ? renderLegend() : null,
    hasAttempts
      ? h('ol', { class: 'history' }, ...game.history.map(renderAttempt))
      : h(
          'p',
          { class: 'hint' },
          `No attempts yet. Try any ${length} different digits.`,
        ),
  );
};

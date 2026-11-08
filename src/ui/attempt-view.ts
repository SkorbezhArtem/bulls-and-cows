import type { Attempt } from '../game/state.js';
import { h } from './dom.js';
import { pluralize } from './format.js';

const renderPegs = (count: number, kind: 'bull' | 'cow'): HTMLElement[] =>
  Array.from({ length: count }, () => h('span', { class: `peg peg-${kind}` }));

export const renderAttempt = ({ guess, bulls, cows }: Attempt): HTMLElement =>
  h(
    'li',
    {},
    h(
      'span',
      { class: 'tiles' },
      ...[...guess].map((digit) => h('span', { class: 'tile' }, digit)),
    ),
    h(
      'span',
      { class: 'attempt-result' },
      h(
        'span',
        { class: 'pegs', 'aria-hidden': 'true' },
        ...renderPegs(bulls, 'bull'),
        ...renderPegs(cows, 'cow'),
      ),
      h(
        'span',
        { class: 'attempt-text' },
        `${bulls} ${pluralize(bulls, 'bull')}, ${cows} ${pluralize(cows, 'cow')}`,
      ),
    ),
  );

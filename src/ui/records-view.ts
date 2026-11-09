import { getRecordsFor, type GameRecord } from '../game/records.js';
import type { GameSettings } from '../game/state.js';
import { h } from './dom.js';
import { formatDuration } from './format.js';

type RecordsTableProps = {
  records: readonly GameRecord[];
  settings: GameSettings;
};

export const renderRecordsTable = ({
  records,
  settings,
}: RecordsTableProps): HTMLElement => {
  const top = getRecordsFor(records, settings);

  if (top.length === 0) {
    return h(
      'p',
      { class: 'empty' },
      'No results yet. Win a round to set the first record.',
    );
  }

  return h(
    'table',
    {},
    h(
      'thead',
      {},
      h(
        'tr',
        {},
        h('th', { scope: 'col' }, '#'),
        h('th', { scope: 'col' }, 'Attempts'),
        h('th', { scope: 'col' }, 'Time'),
      ),
    ),
    h(
      'tbody',
      {},
      ...top.map((record, index) =>
        h(
          'tr',
          {},
          h('td', {}, String(index + 1)),
          h('td', {}, String(record.attempts)),
          h('td', {}, formatDuration(record.timeMs)),
        ),
      ),
    ),
  );
};

import { THEMES, type Theme } from '../utils/theme.js';
import { h } from './dom.js';

const LABELS: Record<Theme, string> = {
  system: 'System theme',
  light: 'Light theme',
  dark: 'Dark theme',
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;

  if (theme === 'system') {
    root.removeAttribute('data-theme');
  } else {
    root.dataset.theme = theme;
  }
};

type ThemeSwitcherProps = {
  theme: Theme;
  onChange: (theme: Theme) => void;
};

export const renderThemeSwitcher = ({
  theme,
  onChange,
}: ThemeSwitcherProps): HTMLElement =>
  h(
    'div',
    { class: 'theme-switcher', role: 'group', 'aria-label': 'Color theme' },
    ...THEMES.map((value) =>
      h('button', {
        type: 'button',
        id: `theme-${value}`,
        class: `theme-option theme-${value}`,
        title: LABELS[value],
        'aria-label': LABELS[value],
        'aria-pressed': String(value === theme),
        onClick: () => onChange(value),
      }),
    ),
  );

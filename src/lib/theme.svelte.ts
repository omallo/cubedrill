import { browser } from '$app/environment';

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

const STORAGE_KEY = 'cubedrill-theme';

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/**
 * Reactive theme controller. Owns the user's light/dark/system preference,
 * persists it, keeps the `.dark` class on <html> in sync, and tracks the OS
 * setting so `system` stays live. A single shared instance is exported as
 * `theme`. The no-FOUC bootstrap in app.html mirrors this logic for first paint.
 */
class ThemeController {
  /** The user's explicit choice. */
  preference = $state<ThemePreference>('system');
  /** Whether the OS currently prefers dark — kept reactive via a listener. */
  #systemDark = $state(false);

  constructor() {
    if (!browser) return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (isThemePreference(stored)) {
      this.preference = stored;
    }

    const media = window.matchMedia('(prefers-color-scheme: dark)');
    this.#systemDark = media.matches;
    media.addEventListener('change', (event) => {
      this.#systemDark = event.matches;
      this.#apply();
    });
  }

  /** The theme actually in effect right now. */
  get resolved(): ResolvedTheme {
    if (this.preference === 'system') {
      return this.#systemDark ? 'dark' : 'light';
    }
    return this.preference;
  }

  /** Set and persist the preference, then apply it to the document. */
  set(preference: ThemePreference): void {
    this.preference = preference;
    if (!browser) return;
    localStorage.setItem(STORAGE_KEY, preference);
    this.#apply();
  }

  /** Flip between light and dark based on what's currently showing. */
  toggle(): void {
    this.set(this.resolved === 'dark' ? 'light' : 'dark');
  }

  #apply(): void {
    if (!browser) return;
    const dark = this.resolved === 'dark';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
  }
}

export const theme = new ThemeController();

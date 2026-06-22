/** A keyboard shortcut: the key(s) to press and what it does. */
export type Shortcut = {
  /** Key tokens shown as separate <kbd>s (e.g. ['←', '→'] or ['Space']). */
  keys: string[];
  description: string;
};

/** Shortcuts grouped by the context (view) they apply in. */
export type ShortcutGroup = {
  context: string;
  shortcuts: Shortcut[];
};

/**
 * The single source of truth for the keyboard-shortcuts reference, surfaced by
 * the global `?` overlay. This documents the shortcuts; the handlers that
 * implement them live with their views (the trainer, the set page, app-shell) —
 * keep this list in step with those when adding or changing a binding.
 */
export const SHORTCUTS: ShortcutGroup[] = [
  {
    context: 'Global',
    shortcuts: [
      { keys: ['?'], description: 'Show this keyboard-shortcuts reference' },
      { keys: ['Esc'], description: 'Close dialogs and the mobile menu' }
    ]
  },
  {
    context: 'Algorithms · List view',
    shortcuts: [
      { keys: ['v'], description: 'Toggle 2D / 3D view' },
      { keys: ['h'], description: 'Toggle hint facelets' }
    ]
  },
  {
    context: 'Algorithms · Recall drill',
    shortcuts: [
      { keys: ['Space'], description: 'Reveal solution · then grade “Got it” and advance' },
      { keys: ['1', '2', '3'], description: 'Grade recall: got it · hesitated · blanked' },
      { keys: ['←'], description: 'Previous case (no grade)' },
      { keys: ['→'], description: 'Next case (no grade)' },
      { keys: ['p'], description: 'Play the algorithm' },
      { keys: ['r'], description: 'Reset the cube' },
      { keys: ['s'], description: 'Toggle shuffle order' },
      { keys: ['t'], description: 'Show / hide the session summary' },
      { keys: ['h'], description: 'Toggle hint facelets' },
      { keys: ['v'], description: 'Toggle 2D / 3D view' },
      { keys: ['m'], description: 'Cycle the learning status' }
    ]
  }
];

/**
 * Global open-state for the shortcuts overlay. Shared so any view (the header
 * button, the `?` key) can toggle the single modal mounted in the app shell.
 */
class ShortcutsOverlay {
  open = $state(false);

  toggle(): void {
    this.open = !this.open;
  }

  close(): void {
    this.open = false;
  }
}

export const shortcutsOverlay = new ShortcutsOverlay();

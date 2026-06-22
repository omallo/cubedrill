/**
 * Global open-state for the ⌘K command palette. Shared so the header button and
 * the ⌘K / Ctrl-K shortcut both drive the single palette mounted in the shell.
 */
class CommandPalette {
  open = $state(false);

  toggle(): void {
    this.open = !this.open;
  }

  show(): void {
    this.open = true;
  }

  close(): void {
    this.open = false;
  }
}

export const commandPalette = new CommandPalette();

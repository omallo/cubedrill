<script lang="ts">
  import { X } from 'lucide-svelte';
  import { fade, scale } from 'svelte/transition';
  import { SHORTCUTS, shortcutsOverlay } from '$lib/shortcuts.svelte';

  /** Don't hijack `?` while the user is typing into a field. */
  function isTyping(target: EventTarget | null): boolean {
    return (
      target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      (target instanceof HTMLElement && target.isContentEditable)
    );
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape' && shortcutsOverlay.open) {
      shortcutsOverlay.close();
      return;
    }
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey && !isTyping(e.target)) {
      e.preventDefault();
      shortcutsOverlay.toggle();
    }
  }
</script>

<svelte:window onkeydown={onKeydown} />

{#if shortcutsOverlay.open}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4">
    <button
      type="button"
      aria-label="Close keyboard shortcuts"
      class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
      onclick={() => shortcutsOverlay.close()}
      transition:fade={{ duration: 150 }}
    ></button>

    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      class="relative z-10 flex max-h-[85vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl"
      transition:scale={{ duration: 150, start: 0.97, opacity: 0 }}
    >
      <div class="flex items-center justify-between border-b border-border px-5 py-4">
        <h2 class="text-base font-semibold text-foreground">Keyboard shortcuts</h2>
        <button
          type="button"
          aria-label="Close"
          onclick={() => shortcutsOverlay.close()}
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X size={18} />
        </button>
      </div>

      <div class="space-y-6 overflow-y-auto px-5 py-5">
        {#each SHORTCUTS as group (group.context)}
          <section>
            <h3 class="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {group.context}
            </h3>
            <ul class="divide-y divide-border">
              {#each group.shortcuts as shortcut (shortcut.description)}
                <li class="flex items-center justify-between gap-4 py-1.5">
                  <span class="text-sm text-foreground">{shortcut.description}</span>
                  <span class="flex shrink-0 items-center gap-1">
                    {#each shortcut.keys as key (key)}
                      <kbd
                        class="inline-flex min-w-6 items-center justify-center rounded-md border border-border bg-surface-muted px-1.5 py-0.5 font-mono text-xs font-medium text-foreground"
                      >
                        {key}
                      </kbd>
                    {/each}
                  </span>
                </li>
              {/each}
            </ul>
          </section>
        {/each}
      </div>
    </div>
  </div>
{/if}

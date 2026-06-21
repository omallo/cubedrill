<script lang="ts">
  import { Lightbulb, Boxes } from 'lucide-svelte';
  import type { Phase } from '$lib/domain';
  import { display } from '$lib/display.svelte';
  import { cn } from '$lib/utils/cn';

  type Props = {
    /** The phase whose cubes these toggles control (every case in a set shares one). */
    phase: Phase | undefined;
  };

  let { phase }: Props = $props();

  // Shared with the trainer's other toggle buttons (shuffle/scramble) — keep in sync.
  const toggleClass = (active: boolean) =>
    cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors',
      active
        ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
        : 'border-border hover:bg-accent'
    );
</script>

<button
  type="button"
  aria-pressed={display.hintFacelets}
  title="Hint facelets (h)"
  onclick={() => display.toggleHint()}
  class={toggleClass(display.hintFacelets)}
>
  <Lightbulb size={15} />
</button>
{#if display.canToggleViz(phase)}
  {@const viz = display.resolveViz(phase)}
  <button
    type="button"
    aria-pressed={viz === '3D'}
    title="Toggle 2D / 3D (v)"
    onclick={() => display.toggleViz(phase)}
    class={cn(toggleClass(viz === '3D'), 'w-auto px-2 text-xs font-semibold')}
  >
    <Boxes size={15} />
    {viz}
  </button>
{/if}

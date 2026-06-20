<script lang="ts">
  import { cn } from '$lib/utils/cn';

  type Props = {
    /** Show the "Cubedrill" wordmark next to the mark. */
    showWordmark?: boolean;
    class?: string;
  };

  let { showWordmark = true, class: className = undefined }: Props = $props();

  // Nine-tile cube face; the brand-colored diagonal hints at a solve in progress.
  const tiles = [
    'opacity-95',
    'opacity-40',
    'opacity-40',
    'opacity-40',
    'opacity-95',
    'opacity-40',
    'opacity-40',
    'opacity-40',
    'opacity-95'
  ];
</script>

<span class={cn('inline-flex items-center gap-2.5', className)}>
  <svg
    viewBox="0 0 32 32"
    class="h-8 w-8 shrink-0"
    role="img"
    aria-label="Cubedrill"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="cubedrill-mark" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="var(--color-brand-500)" />
        <stop offset="100%" stop-color="var(--color-brand-700)" />
      </linearGradient>
    </defs>
    <rect width="32" height="32" rx="8" fill="url(#cubedrill-mark)" />
    {#each tiles as opacity, i (i)}
      {@const col = i % 3}
      {@const row = Math.floor(i / 3)}
      <rect
        x={7 + col * 7}
        y={7 + row * 7}
        width="5"
        height="5"
        rx="1.5"
        fill="white"
        class={opacity}
      />
    {/each}
  </svg>
  {#if showWordmark}
    <span class="text-lg font-bold tracking-tight text-foreground">Cubedrill</span>
  {/if}
</span>

<script lang="ts" module>
  export type BadgeVariant = 'neutral' | 'brand' | 'outline';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cn } from '$lib/utils/cn';

  type Props = {
    variant?: BadgeVariant;
    class?: string;
    children?: Snippet;
  };

  let { variant = 'neutral', class: className = undefined, children }: Props = $props();

  const variants: Record<BadgeVariant, string> = {
    neutral: 'bg-surface-muted text-muted-foreground',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-950 dark:text-brand-300',
    outline: 'border border-border text-muted-foreground'
  };
</script>

<span
  class={cn(
    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
    variants[variant],
    className
  )}
>
  {@render children?.()}
</span>

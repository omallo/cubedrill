<script lang="ts" module>
  export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/cn';

  type Props = Omit<HTMLAnchorAttributes, 'type'> &
    HTMLButtonAttributes & {
      variant?: ButtonVariant;
      size?: ButtonSize;
      /** When set, the button renders as an anchor. */
      href?: string;
      class?: string;
      children?: Snippet;
    };

  let {
    variant = 'primary',
    size = 'md',
    href = undefined,
    class: className = undefined,
    children,
    ...rest
  }: Props = $props();

  const base =
    'inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50';

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-primary-foreground hover:bg-brand-700',
    secondary: 'bg-surface-muted text-foreground hover:bg-accent',
    outline: 'border border-border bg-transparent text-foreground hover:bg-accent',
    ghost: 'bg-transparent text-foreground hover:bg-accent',
    danger: 'bg-cube-red text-white hover:opacity-90'
  };

  const sizes: Record<ButtonSize, string> = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-sm',
    lg: 'h-11 px-6 text-base',
    icon: 'h-10 w-10'
  };

  const classes = $derived(cn(base, variants[variant], sizes[size], className));
</script>

{#if href}
  <a {href} class={classes} {...rest}>
    {@render children?.()}
  </a>
{:else}
  <button class={classes} {...rest}>
    {@render children?.()}
  </button>
{/if}

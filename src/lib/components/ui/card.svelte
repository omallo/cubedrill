<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import { cn } from '$lib/utils/cn';

  type Props = HTMLAttributes<HTMLDivElement> & {
    class?: string;
    children?: Snippet;
  };

  let { class: className = undefined, children, ...rest }: Props = $props();
</script>

<div class={cn('rounded-xl border border-border bg-surface shadow-sm', className)} {...rest}>
  {@render children?.()}
</div>

<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { Card } from '$lib/components/ui';

  type Props = {
    label: string;
    value: string | number;
    icon?: ComponentType;
    /** Small supporting text below the value. */
    hint?: string;
  };

  let { label, value, icon = undefined, hint = undefined }: Props = $props();
</script>

<Card class="p-5">
  <div class="flex items-start justify-between gap-3">
    <div class="space-y-1">
      <p class="text-sm font-medium text-muted-foreground">{label}</p>
      <p class="text-2xl font-bold tracking-tight text-foreground">{value}</p>
      {#if hint}
        <p class="text-xs text-muted-foreground">{hint}</p>
      {/if}
    </div>
    {#if icon}
      {@const Icon = icon}
      <div
        class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
      >
        <Icon size={20} />
      </div>
    {/if}
  </div>
</Card>

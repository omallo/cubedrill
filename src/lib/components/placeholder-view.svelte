<script lang="ts">
  import type { ComponentType } from 'svelte';
  import { Card, Badge } from '$lib/components/ui';

  type Props = {
    title: string;
    description?: string;
    icon?: ComponentType;
  };

  let { title, description = undefined, icon = undefined }: Props = $props();
</script>

<Card class="flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
  {#if icon}
    {@const Icon = icon}
    <div
      class="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
    >
      <Icon size={28} />
    </div>
  {/if}
  <div class="max-w-md space-y-1.5">
    <h3 class="text-lg font-semibold text-foreground">{title}</h3>
    {#if description}
      <p class="text-sm text-muted-foreground">{description}</p>
    {/if}
  </div>
  <Badge variant="brand">Coming soon</Badge>
</Card>

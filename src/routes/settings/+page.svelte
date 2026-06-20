<script lang="ts">
  import { Sun, Moon, Monitor } from 'lucide-svelte';
  import { PageHeader, Card } from '$lib/components';
  import { theme, type ThemePreference } from '$lib/theme.svelte';

  const options: { value: ThemePreference; label: string; icon: typeof Sun }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];
</script>

<svelte:head><title>Settings · Cubedrill</title></svelte:head>

<PageHeader title="Settings" description="App preferences and account." />

<Card class="max-w-xl p-6">
  <h3 class="font-semibold text-foreground">Appearance</h3>
  <p class="mt-1 text-sm text-muted-foreground">Choose how Cubedrill looks.</p>

  <div class="mt-4 grid grid-cols-3 gap-2">
    {#each options as option (option.value)}
      {@const Icon = option.icon}
      {@const active = theme.preference === option.value}
      <button
        type="button"
        onclick={() => theme.set(option.value)}
        aria-pressed={active}
        class="flex flex-col items-center gap-2 rounded-lg border p-4 text-sm font-medium transition-colors
					{active
          ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
          : 'border-border text-muted-foreground hover:bg-accent hover:text-foreground'}"
      >
        <Icon size={20} />
        {option.label}
      </button>
    {/each}
  </div>
</Card>

<script lang="ts">
  import { Sun, Moon, Monitor, Download, Upload, Trash2, CloudOff } from 'lucide-svelte';
  import { PageHeader, Card, Button } from '$lib/components';
  import { theme, type ThemePreference } from '$lib/theme.svelte';
  import { downloadExport, importData, clearData } from '$lib/data';
  import type { IconComponent } from '$lib/types';

  const options: { value: ThemePreference; label: string; icon: IconComponent }[] = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor }
  ];

  let fileInput = $state<HTMLInputElement>();
  let importError = $state<string | null>(null);

  function onImportFile(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    importError = null;
    file
      .text()
      .then((text) => importData(text))
      .catch((err) => (importError = err instanceof Error ? err.message : 'Import failed.'));
  }

  function reset() {
    if (confirm('Erase all learning status, custom algorithms, stats, goals and solves?')) {
      clearData();
      location.reload();
    }
  }
</script>

<svelte:head><title>Settings · Cubedrill</title></svelte:head>

<PageHeader title="Settings" description="App preferences and your data." />

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

<!-- Data management -->
<Card class="mt-6 max-w-xl p-6">
  <h3 class="font-semibold text-foreground">Your data</h3>
  <p class="mt-1 text-sm text-muted-foreground">
    Everything lives in this browser. Export a backup to move it to another device, or import one to
    restore it.
  </p>

  <div class="mt-4 flex flex-wrap gap-2">
    <Button variant="outline" onclick={downloadExport}>
      <Download size={16} /> Export backup
    </Button>
    <Button variant="outline" onclick={() => fileInput?.click()}>
      <Upload size={16} /> Import backup
    </Button>
    <input
      bind:this={fileInput}
      type="file"
      accept="application/json,.json"
      class="hidden"
      onchange={onImportFile}
    />
    <Button variant="danger" onclick={reset}>
      <Trash2 size={16} /> Reset all data
    </Button>
  </div>
  {#if importError}
    <p class="mt-3 text-sm text-rose-600 dark:text-rose-400">{importError}</p>
  {/if}
</Card>

<!-- Account / sync -->
<Card class="mt-6 max-w-xl p-6">
  <div class="flex items-start gap-3">
    <div
      class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-muted text-muted-foreground"
    >
      <CloudOff size={20} />
    </div>
    <div>
      <h3 class="font-semibold text-foreground">Account &amp; sync</h3>
      <p class="mt-1 text-sm text-muted-foreground">
        Cubedrill is local-first and fully usable without an account. Optional cross-device sync is
        planned for a future release — until then, use Export and Import above.
      </p>
    </div>
  </div>
</Card>

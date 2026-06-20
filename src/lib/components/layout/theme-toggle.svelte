<script lang="ts">
  import { Sun, Moon } from 'lucide-svelte';
  import { Button } from '$lib/components/ui';
  import { theme } from '$lib/theme.svelte';

  const isDark = $derived(theme.resolved === 'dark');
</script>

<Button
  variant="ghost"
  size="icon"
  onclick={() => theme.toggle()}
  aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
  title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
>
  {#if isDark}
    <Sun size={20} />
  {:else}
    <Moon size={20} />
  {/if}
</Button>

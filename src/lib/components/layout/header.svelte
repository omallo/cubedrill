<script lang="ts">
  import { Menu, Bluetooth, Keyboard, Loader2 } from 'lucide-svelte';
  import { page } from '$app/state';
  import { allNavItems } from '$lib/config/navigation';
  import { Button } from '$lib/components/ui';
  import { shortcutsOverlay } from '$lib/shortcuts.svelte';
  import { smartCube } from '$lib/smartcube.svelte';
  import ThemeToggle from './theme-toggle.svelte';

  type Props = {
    /** Opens the mobile navigation drawer. */
    onMenuClick?: () => void;
  };

  let { onMenuClick }: Props = $props();

  // Resolve the current page title from the nav config (longest matching href).
  const pageTitle = $derived.by(() => {
    const path = page.url.pathname;
    const match = allNavItems
      .filter((item) => (item.href === '/' ? path === '/' : path.startsWith(item.href)))
      .sort((a, b) => b.href.length - a.href.length)[0];
    return match?.label ?? 'Cubedrill';
  });
</script>

<header
  class="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-surface/80 px-4 backdrop-blur lg:px-6"
>
  <Button
    variant="ghost"
    size="icon"
    class="lg:hidden"
    onclick={onMenuClick}
    aria-label="Open navigation"
  >
    <Menu size={20} />
  </Button>

  <h1 class="text-base font-semibold text-foreground">{pageTitle}</h1>

  <div class="ml-auto flex items-center gap-1">
    <!-- Smart-cube connection — an optional progressive enhancement. -->
    {#if smartCube.status === 'connected'}
      <Button
        variant="ghost"
        size="sm"
        class="hidden sm:inline-flex"
        onclick={() => smartCube.disconnect()}
        title={`${smartCube.name} connected — click to disconnect`}
      >
        <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
        <span class="max-w-32 truncate">{smartCube.name}</span>
      </Button>
    {:else}
      <Button
        variant="ghost"
        size="sm"
        class="hidden sm:inline-flex"
        onclick={() => smartCube.connect()}
        disabled={!smartCube.available || smartCube.status === 'connecting'}
        title={smartCube.available
          ? 'Connect a Bluetooth smart cube'
          : 'Web Bluetooth is not available in this browser'}
      >
        {#if smartCube.status === 'connecting'}
          <Loader2 size={16} class="animate-spin" />
          <span>Connecting…</span>
        {:else}
          <Bluetooth size={16} />
          <span>Connect cube</span>
        {/if}
      </Button>
    {/if}
    <Button
      variant="ghost"
      size="icon"
      onclick={() => shortcutsOverlay.toggle()}
      aria-label="Keyboard shortcuts"
      title="Keyboard shortcuts (?)"
    >
      <Keyboard size={20} />
    </Button>
    <ThemeToggle />
  </div>
</header>

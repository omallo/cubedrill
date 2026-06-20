<script lang="ts">
  import { Menu, Bluetooth } from 'lucide-svelte';
  import { page } from '$app/state';
  import { allNavItems } from '$lib/config/navigation';
  import { Button } from '$lib/components/ui';
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
    <!-- Smart-cube connection is an optional progressive enhancement (placeholder). -->
    <Button variant="ghost" size="sm" class="hidden sm:inline-flex" disabled>
      <Bluetooth size={16} />
      <span>Connect cube</span>
    </Button>
    <ThemeToggle />
  </div>
</header>

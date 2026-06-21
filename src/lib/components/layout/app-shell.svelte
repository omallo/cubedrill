<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import Sidebar from './sidebar.svelte';
  import Header from './header.svelte';
  import KeyboardShortcuts from './keyboard-shortcuts.svelte';

  type Props = {
    children?: Snippet;
  };

  let { children }: Props = $props();

  let mobileOpen = $state(false);
  const closeMobile = () => (mobileOpen = false);
</script>

<div class="min-h-screen bg-background">
  <!-- Persistent sidebar (desktop) -->
  <aside class="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border lg:block">
    <Sidebar />
  </aside>

  <!-- Off-canvas drawer (mobile) -->
  {#if mobileOpen}
    <div class="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
        onclick={closeMobile}
        transition:fade={{ duration: 150 }}
      ></button>
      <aside
        class="absolute inset-y-0 left-0 w-64 border-r border-border shadow-xl"
        transition:fly={{ x: -288, duration: 200 }}
      >
        <Sidebar onNavigate={closeMobile} />
      </aside>
    </div>
  {/if}

  <!-- Main column -->
  <div class="lg:pl-64">
    <Header onMenuClick={() => (mobileOpen = true)} />
    <main class="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      {@render children?.()}
    </main>
  </div>
</div>

<!-- Global keyboard-shortcuts overlay (opens on `?`, mounted once). -->
<KeyboardShortcuts />

<svelte:window onkeydown={(e) => e.key === 'Escape' && closeMobile()} />

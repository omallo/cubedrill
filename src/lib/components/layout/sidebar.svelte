<script lang="ts">
  import { primaryNav, footerNav } from '$lib/config/navigation';
  import BrandLogo from './brand-logo.svelte';
  import SidebarNavItem from './sidebar-nav-item.svelte';

  type Props = {
    /** Called after navigating (used to close the mobile drawer). */
    onNavigate?: () => void;
  };

  let { onNavigate }: Props = $props();
</script>

<div class="flex h-full flex-col bg-surface">
  <!-- Brand -->
  <div class="flex h-16 items-center border-b border-border px-5">
    <a href="/" onclick={onNavigate} class="rounded-md">
      <BrandLogo />
    </a>
  </div>

  <!-- Navigation -->
  <nav class="flex-1 space-y-6 overflow-y-auto px-3 py-5">
    {#each primaryNav as section, i (i)}
      <div class="space-y-1">
        {#if section.title}
          <p class="px-3 pb-1 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {section.title}
          </p>
        {/if}
        {#each section.items as item (item.href)}
          <SidebarNavItem {item} {onNavigate} />
        {/each}
      </div>
    {/each}
  </nav>

  <!-- Footer -->
  <div class="space-y-1 border-t border-border px-3 py-4">
    {#each footerNav as item (item.href)}
      <SidebarNavItem {item} {onNavigate} />
    {/each}
  </div>
</div>

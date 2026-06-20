<script lang="ts">
  import { page } from '$app/state';
  import type { NavItem } from '$lib/config/navigation';
  import { cn } from '$lib/utils/cn';

  type Props = {
    item: NavItem;
    /** Called after navigation (used to close the mobile drawer). */
    onNavigate?: () => void;
  };

  let { item, onNavigate }: Props = $props();

  const isActive = $derived.by(() => {
    const path = page.url.pathname;
    if (item.href === '/') return path === '/';
    return path === item.href || path.startsWith(item.href + '/');
  });
</script>

<a
  href={item.href}
  onclick={onNavigate}
  aria-current={isActive ? 'page' : undefined}
  class={cn(
    'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300'
      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
  )}
>
  <item.icon
    size={18}
    class={cn(
      'shrink-0 transition-colors',
      isActive
        ? 'text-brand-600 dark:text-brand-400'
        : 'text-muted-foreground group-hover:text-foreground'
    )}
  />
  <span>{item.label}</span>
</a>

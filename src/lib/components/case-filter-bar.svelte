<script lang="ts">
  import type { Snippet } from 'svelte';
  import { X } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';
  import type { LearningStatus, SetGroup } from '$lib/domain';
  import { STATUS_META } from './learning-status-control.svelte';

  type Props = {
    /** Groups available for the group filter (omit / empty to hide it). */
    groups?: SetGroup[];
    /** Active status filters (empty = all). */
    statuses: LearningStatus[];
    /** Active group id, or null for all. */
    group: string | null;
    /** Cases shown after filtering, and the set total. */
    shown: number;
    total: number;
    ontoggleStatus: (status: LearningStatus) => void;
    onsetGroup: (id: string | null) => void;
    onclear: () => void;
    /** Optional view controls (e.g. 2D/3D + hint toggles) shown on the right. */
    controls?: Snippet;
  };

  let {
    groups = [],
    statuses,
    group,
    shown,
    total,
    ontoggleStatus,
    onsetGroup,
    onclear,
    controls
  }: Props = $props();

  const ALL_STATUSES: LearningStatus[] = ['not-learned', 'learning', 'mastered'];
  const hasFilters = $derived(statuses.length > 0 || group !== null);

  // The row control's neutral 'not-learned' style reads as unselected here, so give
  // an active not-learned chip a filled neutral look; colored statuses reuse STATUS_META.
  const activeClass = (s: LearningStatus) =>
    s === 'not-learned'
      ? 'border-foreground/20 bg-surface-muted text-foreground'
      : STATUS_META[s].chip;
</script>

<div class="mb-6 flex flex-wrap items-center gap-3">
  <div class="flex flex-wrap items-center gap-1.5">
    {#each ALL_STATUSES as s (s)}
      {@const active = statuses.includes(s)}
      <button
        type="button"
        aria-pressed={active}
        onclick={() => ontoggleStatus(s)}
        class={cn(
          'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
          active ? activeClass(s) : 'border-border text-muted-foreground hover:bg-surface-muted'
        )}
      >
        <span class={cn('h-2 w-2 rounded-full', STATUS_META[s].dot)}></span>
        {STATUS_META[s].label}
      </button>
    {/each}
  </div>

  {#if groups.length > 0}
    <select
      value={group ?? ''}
      onchange={(e) => onsetGroup(e.currentTarget.value || null)}
      aria-label="Filter by group"
      class="cursor-pointer rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-foreground focus:border-brand-500 focus:ring-brand-500"
    >
      <option value="">All groups</option>
      {#each groups as g (g.id)}
        <option value={g.id}>{g.name}</option>
      {/each}
    </select>
  {/if}

  <div class="ml-auto flex items-center gap-3 text-sm text-muted-foreground">
    <span>{shown} of {total}</span>
    {#if hasFilters}
      <button
        type="button"
        onclick={onclear}
        class="inline-flex cursor-pointer items-center gap-1 rounded-md px-1.5 py-1 transition-colors hover:text-foreground"
      >
        <X size={14} /> Clear
      </button>
    {/if}
    {#if controls}
      <div class="flex items-center gap-1.5">{@render controls()}</div>
    {/if}
  </div>
</div>

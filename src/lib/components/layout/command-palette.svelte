<script lang="ts">
  import { fade, scale } from 'svelte/transition';
  import { Search, Blocks, GraduationCap, Box, CornerDownLeft } from 'lucide-svelte';
  import { goto } from '$app/navigation';
  import { catalog, techniques } from '$lib/domain';
  import { primaryNav, footerNav } from '$lib/config/navigation';
  import { commandPalette } from '$lib/palette.svelte';
  import type { IconComponent } from '$lib/types';
  import { cn } from '$lib/utils/cn';

  type Entry = {
    id: string;
    type: string;
    title: string;
    subtitle?: string;
    href: string;
    icon: IconComponent;
  };

  // Build a flat, searchable index once: nav pages, sets, techniques, and every
  // case (deep-linked to a set that contains it, with its group pre-filtered).
  const index: Entry[] = (() => {
    const entries: Entry[] = [];
    for (const item of [...primaryNav.flatMap((s) => s.items), ...footerNav]) {
      entries.push({
        id: `nav:${item.href}`,
        type: 'Page',
        title: item.label,
        subtitle: item.description,
        href: item.href,
        icon: item.icon
      });
    }
    const phaseName = (id: string) => catalog.phases.find((p) => p.id === id)?.name;
    for (const set of catalog.sets) {
      entries.push({
        id: `set:${set.id}`,
        type: 'Set',
        title: set.name,
        subtitle: phaseName(set.phaseId),
        href: `/algorithms/${set.id}`,
        icon: Blocks
      });
    }
    for (const t of techniques) {
      entries.push({
        id: `tech:${t.id}`,
        type: 'Technique',
        title: t.name,
        href: `/techniques/${t.id}`,
        icon: GraduationCap
      });
    }
    // One entry per (case, set) so set-relative names are all searchable — e.g.
    // OLL 27 surfaces as "OLL 27" in Full OLL and as "Sune" in 2-Look OLL.
    const caseById = new Map(catalog.cases.map((c) => [c.id, c]));
    for (const m of catalog.memberships) {
      const c = caseById.get(m.caseId);
      const set = catalog.sets.find((s) => s.id === m.setId);
      if (!c || !set) continue;
      const params = m.groupId ? `?group=${encodeURIComponent(m.groupId)}` : '';
      entries.push({
        id: `case:${m.setId}:${c.id}`,
        type: 'Case',
        title: m.label ?? c.name,
        subtitle: [set.name, c.nickname].filter(Boolean).join(' · '),
        href: `/algorithms/${m.setId}${params}`,
        icon: Box
      });
    }
    return entries;
  })();

  let query = $state('');
  let selected = $state(0);
  let inputEl = $state<HTMLInputElement>();

  const results = $derived.by(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Empty query: show the pages as a quick launcher.
      return index.filter((e) => e.type === 'Page');
    }
    const scored = index
      .map((e) => {
        const hay = `${e.title} ${e.subtitle ?? ''}`.toLowerCase();
        const idx = hay.indexOf(q);
        if (idx < 0) return null;
        // Rank: title prefix beats title contains beats subtitle match.
        const title = e.title.toLowerCase();
        const score = title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2;
        return { e, score, idx };
      })
      .filter((x): x is { e: Entry; score: number; idx: number } => x !== null)
      .sort((a, b) => a.score - b.score || a.idx - b.idx)
      .slice(0, 30);
    return scored.map((x) => x.e);
  });

  // Keep the selection in range as results change.
  $effect(() => {
    if (selected >= results.length) selected = Math.max(0, results.length - 1);
  });

  // Focus the input and reset when the palette opens.
  $effect(() => {
    if (commandPalette.open) {
      query = '';
      selected = 0;
      queueMicrotask(() => inputEl?.focus());
    }
  });

  function choose(entry: Entry | undefined) {
    if (!entry) return;
    commandPalette.close();
    goto(entry.href);
  }

  function onInputKeydown(e: KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selected = Math.min(selected + 1, results.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selected = Math.max(selected - 1, 0);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[selected]);
    }
  }

  // Global open shortcut: ⌘K / Ctrl-K, and Esc to close.
  function onWindowKeydown(e: KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      commandPalette.toggle();
    } else if (e.key === 'Escape' && commandPalette.open) {
      commandPalette.close();
    }
  }
</script>

<svelte:window onkeydown={onWindowKeydown} />

{#if commandPalette.open}
  <div class="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[12vh]">
    <button
      type="button"
      aria-label="Close search"
      class="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
      onclick={() => commandPalette.close()}
      transition:fade={{ duration: 120 }}
    ></button>

    <div
      class="relative w-full max-w-xl overflow-hidden rounded-xl border border-border bg-surface shadow-2xl"
      transition:scale={{ duration: 140, start: 0.97 }}
    >
      <div class="flex items-center gap-3 border-b border-border px-4">
        <Search size={18} class="shrink-0 text-muted-foreground" />
        <input
          bind:this={inputEl}
          bind:value={query}
          onkeydown={onInputKeydown}
          placeholder="Search cases, sets, pages…"
          spellcheck="false"
          autocomplete="off"
          class="h-12 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
        <kbd class="rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground">
          Esc
        </kbd>
      </div>

      <div class="max-h-[50vh] overflow-y-auto p-2">
        {#if results.length === 0}
          <p class="px-3 py-6 text-center text-sm text-muted-foreground">No matches.</p>
        {:else}
          <ul>
            {#each results as entry, i (entry.id)}
              {@const Icon = entry.icon}
              <li>
                <button
                  type="button"
                  onclick={() => choose(entry)}
                  onmouseenter={() => (selected = i)}
                  class={cn(
                    'flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left',
                    i === selected ? 'bg-accent' : ''
                  )}
                >
                  <Icon size={16} class="shrink-0 text-muted-foreground" />
                  <span class="min-w-0 flex-1">
                    <span class="block truncate text-sm font-medium text-foreground">
                      {entry.title}
                    </span>
                    {#if entry.subtitle}
                      <span class="block truncate text-xs text-muted-foreground">
                        {entry.subtitle}
                      </span>
                    {/if}
                  </span>
                  <span class="shrink-0 text-[10px] tracking-wide text-muted-foreground uppercase">
                    {entry.type}
                  </span>
                  {#if i === selected}
                    <CornerDownLeft size={14} class="shrink-0 text-muted-foreground" />
                  {/if}
                </button>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
{/if}

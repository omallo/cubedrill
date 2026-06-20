<script lang="ts">
  import { ArrowLeft, List, Dumbbell } from 'lucide-svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import { PageHeader, Card, LearningStatusControl, CaseFilterBar } from '$lib/components';
  import { CaseDiagram } from '$lib/components/cube';
  // Imported directly (not via the barrel) so cubing.js stays out of the main bundle.
  import AlgorithmTrainer from '$lib/components/train/algorithm-trainer.svelte';
  import {
    getSet,
    caseGroupsInSet,
    type Algorithm,
    type LearningStatus,
    type SetGroup
  } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { cn } from '$lib/utils/cn';

  const set = $derived(getSet(page.params.set ?? ''));
  const allGroups = $derived(set ? caseGroupsInSet(set.id) : []);
  const allCaseIds = $derived(allGroups.flatMap((g) => g.cases.map((c) => c.case.id)));
  const totalCases = $derived(allCaseIds.length);
  const masteredCount = $derived(personal.count(allCaseIds, 'mastered'));
  const learningCount = $derived(personal.count(allCaseIds, 'learning'));

  // Groups present in this set, for the group filter dropdown.
  const filterGroups = $derived(
    allGroups.map((s) => s.group).filter((g): g is SetGroup => g !== undefined)
  );

  // --- View mode + filters live in the URL ---------------------------------
  // ?mode=train (list is the default) & ?status=learning,mastered & group=dot
  const mode = $derived(page.url.searchParams.get('mode') === 'train' ? 'train' : 'list');

  const VALID_STATUS: LearningStatus[] = ['not-learned', 'learning', 'mastered'];
  const statusFilter = $derived(
    (page.url.searchParams.get('status') ?? '')
      .split(',')
      .filter((s): s is LearningStatus => (VALID_STATUS as string[]).includes(s))
  );
  const groupFilter = $derived(page.url.searchParams.get('group'));

  function updateParams(mutate: (p: URLSearchParams) => void) {
    const params = new URLSearchParams(page.url.searchParams);
    mutate(params);
    const qs = params.toString();
    goto(qs ? `?${qs}` : page.url.pathname, {
      replaceState: true,
      keepFocus: true,
      noScroll: true
    });
  }

  function setMode(m: 'list' | 'train') {
    updateParams((p) => (m === 'train' ? p.set('mode', 'train') : p.delete('mode')));
  }

  function toggleStatus(s: LearningStatus) {
    const next = statusFilter.includes(s)
      ? statusFilter.filter((x) => x !== s)
      : [...statusFilter, s];
    updateParams((p) => (next.length ? p.set('status', next.join(',')) : p.delete('status')));
  }

  function setGroup(id: string | null) {
    updateParams((p) => (id ? p.set('group', id) : p.delete('group')));
  }

  function clearFilters() {
    updateParams((p) => {
      p.delete('status');
      p.delete('group');
    });
  }

  // Apply filters. personal.status() is read here, so cycling a case re-filters live.
  const filteredGroups = $derived(
    allGroups
      .filter((section) => !groupFilter || section.group?.id === groupFilter)
      .map((section) => ({
        ...section,
        cases: section.cases.filter(
          (c) => statusFilter.length === 0 || statusFilter.includes(personal.status(c.case.id))
        )
      }))
      .filter((section) => section.cases.length > 0)
  );
  const shownCount = $derived(filteredGroups.reduce((n, g) => n + g.cases.length, 0));

  // The trainer drills exactly what the list shows, in the same order.
  const pool = $derived(filteredGroups.flatMap((g) => g.cases));
  // Remount the trainer when the deck's identity changes (set or filters) so it
  // re-snapshots; status is intentionally excluded (cycling shouldn't resize it).
  const sessionKey = $derived(`${set?.id}|${statusFilter.join(',')}|${groupFilter ?? ''}`);

  const primaryAlg = (algorithms: Algorithm[]): Algorithm | undefined =>
    algorithms.find((a) => a.primary) ?? algorithms[0];

  const modeBtn = (active: boolean) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition-colors',
      active
        ? 'bg-primary text-primary-foreground'
        : 'cursor-pointer text-muted-foreground hover:text-foreground'
    );
</script>

<svelte:head><title>{set?.name ?? 'Algorithms'} · Cubedrill</title></svelte:head>

<a
  href="/algorithms"
  class="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
>
  <ArrowLeft size={15} />
  Algorithms
</a>

{#if !set}
  <p class="text-muted-foreground">Set not found.</p>
{:else}
  <PageHeader title={set.name} description={set.description}>
    {#snippet actions()}
      <span class="text-sm text-muted-foreground">
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">{masteredCount}</span>
        mastered ·
        <span class="font-semibold text-amber-600 dark:text-amber-400">{learningCount}</span>
        learning
      </span>
      <div class="inline-flex rounded-lg border border-border bg-surface p-0.5">
        <button type="button" class={modeBtn(mode === 'list')} onclick={() => setMode('list')}>
          <List size={15} /> List
        </button>
        <button type="button" class={modeBtn(mode === 'train')} onclick={() => setMode('train')}>
          <Dumbbell size={15} /> Train
        </button>
      </div>
    {/snippet}
  </PageHeader>

  <CaseFilterBar
    groups={filterGroups}
    statuses={statusFilter}
    group={groupFilter}
    shown={shownCount}
    total={totalCases}
    ontoggleStatus={toggleStatus}
    onsetGroup={setGroup}
    onclear={clearFilters}
  />

  {#if mode === 'train'}
    {#key sessionKey}
      <AlgorithmTrainer {pool} />
    {/key}
  {:else if filteredGroups.length === 0}
    <Card class="p-10 text-center text-sm text-muted-foreground">
      No cases match the current filters.
      <button
        type="button"
        onclick={clearFilters}
        class="ml-1 text-brand-600 hover:underline dark:text-brand-400"
      >
        Clear filters
      </button>
    </Card>
  {:else}
    <div class="space-y-8">
      {#each filteredGroups as section (section.group?.id ?? '_ungrouped')}
        <section>
          {#if section.group}
            <div class="mb-3 flex items-baseline gap-2">
              <h2 class="text-sm font-semibold tracking-wide text-foreground uppercase">
                {section.group.name}
              </h2>
              <span class="text-sm text-muted-foreground">{section.cases.length}</span>
              {#if section.group.description}
                <span class="text-sm text-muted-foreground">· {section.group.description}</span>
              {/if}
            </div>
          {/if}

          <Card class="divide-y divide-border">
            {#each section.cases as entry (entry.case.id)}
              {@const alg = primaryAlg(entry.case.algorithms)}
              <div class="flex items-center gap-4 p-4">
                <CaseDiagram
                  moves={alg?.moves ?? ''}
                  phaseId={entry.case.phaseId}
                  class="w-24 shrink-0"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex items-baseline gap-2">
                    <span class="font-semibold text-foreground">{entry.label}</span>
                    {#if entry.case.nickname}
                      <span class="text-sm text-muted-foreground">{entry.case.nickname}</span>
                    {/if}
                  </div>
                  <div class="mt-1 font-mono text-sm break-words text-muted-foreground">
                    {alg?.moves}
                  </div>
                </div>
                <LearningStatusControl
                  status={personal.status(entry.case.id)}
                  oncycle={() => personal.cycle(entry.case.id)}
                  class="shrink-0"
                />
              </div>
            {/each}
          </Card>
        </section>
      {/each}
    </div>
  {/if}
{/if}

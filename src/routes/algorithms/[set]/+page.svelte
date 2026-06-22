<script lang="ts">
  import {
    ArrowLeft,
    List,
    Dumbbell,
    Play,
    RotateCcw,
    FlipHorizontal2,
    Layers,
    ChevronDown
  } from 'lucide-svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import {
    PageHeader,
    Card,
    LearningStatusControl,
    CaseFilterBar,
    CubeViewToggles
  } from '$lib/components';
  import CaseAlgorithms from '$lib/components/case-algorithms.svelte';
  import { CaseDiagram } from '$lib/components/cube';
  // Imported directly (not via the barrel) so cubing.js stays out of the main bundle.
  import AlgorithmTrainer from '$lib/components/train/algorithm-trainer.svelte';
  import {
    getSet,
    getPhase,
    caseGroupsInSet,
    slotsForCase,
    type CaseInSet,
    type F2LSlot,
    type LearningStatus,
    type SetGroup
  } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { display } from '$lib/display.svelte';
  import { cn } from '$lib/utils/cn';

  const set = $derived(getSet(page.params.set ?? ''));
  const allGroups = $derived(set ? caseGroupsInSet(set.id) : []);
  // Every case in a set shares a phase; it drives the 2D/3D + hint view controls.
  const phase = $derived(getPhase(allGroups[0]?.cases[0]?.case.phaseId ?? ''));
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

  // --- Slot dimension (F2L) ------------------------------------------------
  // F2L cases are learned per slot. `setSlots` is the set's slots in canonical
  // order ([] for OLL/PLL, [FR, FL, BR, BL] for F2L; FL/BL and missing BR are
  // mirror-derived). The slot selector only shows when there's a real choice.
  // ?slot picks the displayed/trained slot; train mode also offers 'all' (drill
  // every slot of each case).
  const SLOT_ORDER: F2LSlot[] = ['FR', 'FL', 'BR', 'BL'];
  const setSlots = $derived(
    SLOT_ORDER.filter((s) =>
      allGroups.some((g) => g.cases.some((c) => slotsForCase(c.case).includes(s)))
    )
  );
  type SlotChoice = F2LSlot | 'all';
  const slotChoices = $derived<SlotChoice[]>(
    setSlots.length <= 1 ? [] : mode === 'train' ? [...setSlots, 'all'] : setSlots
  );
  const selectedSlot = $derived.by<SlotChoice | undefined>(() => {
    if (setSlots.length <= 1) return setSlots[0];
    const raw = page.url.searchParams.get('slot');
    return (slotChoices as string[]).includes(raw ?? '') ? (raw as SlotChoice) : setSlots[0];
  });
  // The concrete slot shown in list rows ('all' has no single view → base slot).
  const listSlot = $derived<F2LSlot | undefined>(
    selectedSlot === 'all' ? setSlots[0] : (selectedSlot as F2LSlot | undefined)
  );

  function setSlot(s: SlotChoice) {
    updateParams((p) => (s === setSlots[0] ? p.delete('slot') : p.set('slot', s)));
  }

  /** The slot to render/track for a case given the wanted view: the wanted slot
   *  if the case has it, else the case's base slot (undefined for OLL/PLL). */
  function slotFor(c: CaseInSet, want: F2LSlot | undefined): F2LSlot | undefined {
    const slots = slotsForCase(c.case);
    if (slots.length === 0) return undefined;
    return want && slots.includes(want) ? want : slots[0];
  }

  /** Status used for filtering & the list chip: the displayed slot, except an
   *  'all' training session filters on the rolled-up case status. */
  function filterStatusOf(c: CaseInSet): LearningStatus {
    if (mode === 'train' && selectedSlot === 'all') return personal.caseStatus(c.case.id);
    return personal.status(c.case.id, slotFor(c, listSlot));
  }

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

  // Apply filters. filterStatusOf() reads personal state, so cycling re-filters live.
  const filteredGroups = $derived(
    allGroups
      .filter((section) => !groupFilter || section.group?.id === groupFilter)
      .map((section) => ({
        ...section,
        cases: section.cases.filter(
          (c) => statusFilter.length === 0 || statusFilter.includes(filterStatusOf(c))
        )
      }))
      .filter((section) => section.cases.length > 0)
  );
  const shownCount = $derived(filteredGroups.reduce((n, g) => n + g.cases.length, 0));

  // The trainer drills exactly what the list shows, in the same order. An 'all'
  // session expands each case into one card per slot; otherwise each case is a
  // single card on the displayed slot.
  const pool = $derived.by<(CaseInSet & { slot?: F2LSlot })[]>(() => {
    const cases = filteredGroups.flatMap((g) => g.cases);
    if (selectedSlot === 'all') {
      return cases.flatMap((c) => {
        const slots = slotsForCase(c.case);
        return slots.length ? slots.map((slot) => ({ ...c, slot })) : [{ ...c }];
      });
    }
    return cases.map((c) => ({ ...c, slot: slotFor(c, listSlot) }));
  });
  // Remount the trainer when the deck's identity changes (set, slot or filters)
  // so it re-snapshots; status is intentionally excluded (cycling shouldn't resize it).
  const sessionKey = $derived(
    `${set?.id}|${selectedSlot ?? ''}|${statusFilter.join(',')}|${groupFilter ?? ''}`
  );

  // Per-row CaseDiagram refs so the row's Play/Reset controls can drive the cube.
  const diagrams: Record<string, CaseDiagram> = $state({});

  // Which rows have their algorithm panel (selection + authoring) expanded.
  let expandedAlgs = $state<Record<string, boolean>>({});
  function toggleAlgs(caseId: string) {
    expandedAlgs = { ...expandedAlgs, [caseId]: !expandedAlgs[caseId] };
  }

  // List-mode view shortcuts mirroring the trainer's (which owns these in train
  // mode via its own handler). Skipped while typing or with a modifier held.
  function onListKeydown(e: KeyboardEvent) {
    if (mode !== 'list' || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
    if (e.key === 'v') {
      if (display.canToggleViz(phase)) display.toggleViz(phase);
    } else if (e.key === 'h') {
      display.toggleHint();
    }
  }

  const modeBtn = (active: boolean) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-sm font-medium transition-colors',
      active
        ? 'bg-primary text-primary-foreground'
        : 'cursor-pointer text-muted-foreground hover:text-foreground'
    );
</script>

<svelte:head><title>{set?.name ?? 'Algorithms'} · Cubedrill</title></svelte:head>

<svelte:window onkeydown={onListKeydown} />

{#snippet viewControls()}
  <CubeViewToggles {phase} />
{/snippet}

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
      {#if slotChoices.length > 0}
        <div class="inline-flex rounded-lg border border-border bg-surface p-0.5">
          {#each slotChoices as s (s)}
            <button
              type="button"
              class={modeBtn(selectedSlot === s)}
              title={s === 'all' ? 'Drill every slot' : `Slot ${s}`}
              onclick={() => setSlot(s)}
            >
              {s === 'all' ? 'All' : s}
            </button>
          {/each}
        </div>
      {/if}
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
    controls={mode === 'list' ? viewControls : undefined}
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
              {@const dslot = slotFor(entry, listSlot)}
              {@const alg = personal.chosenAlgorithm(entry.case, dslot)}
              {@const algCount = personal.algorithmsFor(entry.case, dslot).length}
              {@const open = expandedAlgs[entry.case.id]}
              <div class="p-4">
                <div class="flex items-center gap-4">
                  <CaseDiagram
                    moves={alg?.moves ?? ''}
                    phaseId={entry.case.phaseId}
                    visualization={display.resolveViz(phase)}
                    hintFacelets={display.hintFacelets}
                    class="w-24 shrink-0"
                    bind:this={diagrams[entry.case.id]}
                  />
                  <div class="min-w-0 flex-1">
                    <div class="flex items-baseline gap-2">
                      <span class="font-semibold text-foreground">{entry.label}</span>
                      {#if dslot}
                        <span
                          class="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground"
                          title={`Slot ${dslot}`}>{dslot}</span
                        >
                      {/if}
                      {#if alg?.derived}
                        <span
                          class="inline-flex items-center gap-0.5 rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
                          title="Mirror-derived algorithm"
                        >
                          <FlipHorizontal2 size={11} /> mirror
                        </span>
                      {/if}
                      {#if entry.case.nickname}
                        <span class="text-sm text-muted-foreground">{entry.case.nickname}</span>
                      {/if}
                    </div>
                    <div class="mt-1 font-mono text-sm break-words text-muted-foreground">
                      {alg?.moves}
                    </div>
                  </div>
                  <div class="flex shrink-0 items-center gap-1 text-muted-foreground">
                    <button
                      type="button"
                      onclick={() => diagrams[entry.case.id]?.play()}
                      aria-label="Play algorithm"
                      title="Play"
                      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <Play size={16} class="translate-x-px" />
                    </button>
                    <button
                      type="button"
                      onclick={() => diagrams[entry.case.id]?.reset()}
                      aria-label="Reset cube"
                      title="Reset"
                      class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-foreground"
                    >
                      <RotateCcw size={16} />
                    </button>
                    <button
                      type="button"
                      onclick={() => toggleAlgs(entry.case.id)}
                      aria-expanded={open}
                      aria-label="Algorithms"
                      title="Algorithms & custom"
                      class={cn(
                        'flex h-8 cursor-pointer items-center gap-1 rounded-md px-2 text-xs font-medium transition-colors hover:bg-accent hover:text-foreground',
                        open && 'bg-accent text-foreground'
                      )}
                    >
                      <Layers size={15} />
                      {algCount}
                      <ChevronDown
                        size={13}
                        class={cn('transition-transform', open && 'rotate-180')}
                      />
                    </button>
                  </div>
                  <LearningStatusControl
                    status={personal.status(entry.case.id, dslot)}
                    oncycle={() => personal.cycle(entry.case.id, dslot)}
                    class="shrink-0"
                  />
                </div>
                {#if open}
                  <div class="mt-3 border-t border-border pt-3 pl-28">
                    <CaseAlgorithms case={entry.case} slot={dslot} />
                  </div>
                {/if}
              </div>
            {/each}
          </Card>
        </section>
      {/each}
    </div>
  {/if}
{/if}

<script lang="ts">
  import { Target, Plus, X, Trophy, GraduationCap, Flame, Timer, ArrowRight } from 'lucide-svelte';
  import { PageHeader, Card, Button, StatCard, SetProgressBar, Badge } from '$lib/components';
  import {
    catalog,
    setsForPhase,
    casesInSet,
    getCase,
    getSet,
    type LearningStatus
  } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { stats, accuracy, type RecallStat } from '$lib/stats.svelte';
  import { goals, type Goal } from '$lib/goals.svelte';
  import { solves, formatTime } from '$lib/solves.svelte';

  // Phases that actually have algorithm sets to track (skips conceptual Cross).
  const phases = $derived(
    catalog.phases
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((p) => ({ phase: p, sets: setsForPhase(p.id) }))
      .filter((x) => x.sets.length > 0)
  );

  /** mastered / learning / total over a set's cases (live from the personal layer). */
  function coverage(setId: string) {
    const cases = casesInSet(setId);
    let mastered = 0;
    let learning = 0;
    for (const { case: c } of cases) {
      const s = personal.caseStatus(c.id);
      if (s === 'mastered') mastered++;
      else if (s === 'learning') learning++;
    }
    return { mastered, learning, total: cases.length };
  }

  // Headline coverage across all distinct catalog cases.
  const overall = $derived.by(() => {
    let mastered = 0;
    let learning = 0;
    for (const c of catalog.cases) {
      const s = personal.caseStatus(c.id);
      if (s === 'mastered') mastered++;
      else if (s === 'learning') learning++;
    }
    return { mastered, learning, total: catalog.cases.length };
  });

  // Aggregate drill accuracy across every tracked unit.
  const drill = $derived.by(() => {
    let attempts = 0;
    let got = 0;
    let units = 0;
    for (const stat of Object.values(stats.recall)) {
      attempts += stat.attempts;
      got += stat.got;
      units++;
    }
    return { attempts, got, units, acc: attempts ? got / attempts : 0 };
  });

  // Weak cases: lowest recall accuracy among units drilled at least twice — the
  // advisory "what to refine" surface (status stays user-controlled).
  const weak = $derived.by(() => {
    const rows: { key: string; label: string; slot?: string; stat: RecallStat }[] = [];
    for (const [key, stat] of Object.entries(stats.recall)) {
      if (stat.attempts < 2) continue;
      const [caseId, slot] = key.split(':');
      const c = getCase(caseId);
      if (!c) continue;
      rows.push({ key, label: c.name, slot, stat });
    }
    return rows.sort((a, b) => accuracy(a.stat) - accuracy(b.stat)).slice(0, 6);
  });

  // --- Goal creation --------------------------------------------------------
  const allSets = $derived(phases.flatMap((p) => p.sets));
  let newSetId = $state('');
  let newTarget = $state<Goal['target']>('mastered');

  function addGoal() {
    if (newSetId) goals.add(newSetId, newTarget);
  }

  // Suggested goals: sets not yet mastered that aren't already a "master" goal.
  const suggestions = $derived(
    allSets
      .filter((s) => {
        const c = coverage(s.id);
        return c.mastered < c.total && !goals.has(s.id, 'mastered');
      })
      .slice(0, 4)
  );

  const setName = (id: string): string => getSet(id)?.name ?? id;
  const targetLabel = (t: LearningStatus) => (t === 'mastered' ? 'Master' : 'Learn');
</script>

<svelte:head><title>Progress · Cubedrill</title></svelte:head>

<PageHeader
  title="Progress"
  description="Goals, coverage, and feedback to guide what to practice next."
/>

<!-- Headline stats -->
<div class="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <StatCard
    label="Cases mastered"
    value={`${overall.mastered}/${overall.total}`}
    icon={Trophy}
    hint={`${overall.learning} in progress`}
  />
  <StatCard
    label="Drill accuracy"
    value={drill.attempts ? `${Math.round(drill.acc * 100)}%` : '—'}
    icon={GraduationCap}
    hint={drill.attempts ? `${drill.attempts} recalls` : 'No drills yet'}
  />
  <StatCard label="Cases drilled" value={drill.units} icon={Flame} hint="distinct units" />
  <StatCard
    label="Best solve"
    value={isFinite(solves.best) ? formatTime(solves.best) : '—'}
    icon={Timer}
    hint={solves.count ? `${solves.count} solves` : 'No solves yet'}
  />
</div>

<div class="grid gap-6 lg:grid-cols-2">
  <!-- Goals -->
  <Card class="p-6">
    <div class="mb-4 flex items-center gap-2">
      <Target size={18} class="text-brand-600 dark:text-brand-400" />
      <h3 class="font-semibold text-foreground">Goals</h3>
    </div>

    {#if goals.list.length === 0}
      <p class="mb-4 text-sm text-muted-foreground">
        Set a coverage goal to track your progress toward completing a set.
      </p>
    {:else}
      <ul class="mb-4 space-y-3">
        {#each goals.list as goal (goal.id)}
          {@const p = goals.progress(goal)}
          {@const cov = coverage(goal.setId)}
          <li class="rounded-lg border border-border p-3">
            <div class="flex items-center gap-2">
              <span class="font-medium text-foreground">
                {targetLabel(goal.target)} · {setName(goal.setId)}
              </span>
              {#if p.complete}
                <Badge variant="brand">Complete</Badge>
              {/if}
              <span class="ml-auto text-sm text-muted-foreground tabular-nums">
                {p.done}/{p.total}
              </span>
              <button
                type="button"
                aria-label="Remove goal"
                onclick={() => goals.remove(goal.id)}
                class="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-rose-500"
              >
                <X size={13} />
              </button>
            </div>
            <SetProgressBar
              mastered={goal.target === 'mastered' ? p.done : cov.mastered}
              learning={goal.target === 'mastered' ? cov.learning : p.done - cov.mastered}
              total={p.total}
              class="mt-2"
            />
          </li>
        {/each}
      </ul>
    {/if}

    <!-- Add goal -->
    <div class="flex flex-wrap items-center gap-2 border-t border-border pt-4">
      <select
        bind:value={newSetId}
        class="h-9 flex-1 rounded-lg border border-border bg-surface px-2 text-sm text-foreground"
      >
        <option value="" disabled selected>Choose a set…</option>
        {#each allSets as s (s.id)}
          <option value={s.id}>{s.name}</option>
        {/each}
      </select>
      <select
        bind:value={newTarget}
        class="h-9 rounded-lg border border-border bg-surface px-2 text-sm text-foreground"
      >
        <option value="mastered">Master</option>
        <option value="learning">Learn</option>
      </select>
      <Button size="sm" onclick={addGoal} disabled={!newSetId}>
        <Plus size={15} /> Add
      </Button>
    </div>

    {#if suggestions.length}
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span class="text-xs text-muted-foreground">Suggested:</span>
        {#each suggestions as s (s.id)}
          <button
            type="button"
            onclick={() => goals.add(s.id, 'mastered')}
            class="cursor-pointer rounded-full border border-dashed border-border px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-brand-300 hover:text-brand-600 dark:hover:text-brand-400"
          >
            + Master {s.name}
          </button>
        {/each}
      </div>
    {/if}
  </Card>

  <!-- Focus / weak cases -->
  <Card class="p-6">
    <div class="mb-4 flex items-center gap-2">
      <Flame size={18} class="text-brand-600 dark:text-brand-400" />
      <h3 class="font-semibold text-foreground">Focus next</h3>
    </div>
    {#if weak.length === 0}
      <p class="text-sm text-muted-foreground">
        Drill some cases in the trainer and the ones you find hardest will surface here.
      </p>
    {:else}
      <ul class="space-y-2">
        {#each weak as w (w.key)}
          <li class="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-accent">
            <span class="font-medium text-foreground">{w.label}</span>
            {#if w.slot}
              <span class="font-mono text-[11px] text-muted-foreground">{w.slot}</span>
            {/if}
            <span class="ml-auto text-xs text-muted-foreground tabular-nums">
              {Math.round(accuracy(w.stat) * 100)}% · {w.stat.attempts} reps
            </span>
          </li>
        {/each}
      </ul>
      <p class="mt-3 text-xs text-muted-foreground">
        Accuracy is advisory — it never changes your learning status on its own.
      </p>
    {/if}
  </Card>
</div>

<!-- Coverage by phase -->
<section class="mt-8">
  <h3 class="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
    Coverage by set
  </h3>
  <div class="space-y-6">
    {#each phases as { phase, sets } (phase.id)}
      <div>
        <h4 class="mb-3 text-sm font-medium text-foreground">{phase.name}</h4>
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {#each sets as set (set.id)}
            {@const c = coverage(set.id)}
            <a href={`/algorithms/${set.id}`} class="group">
              <Card
                class="h-full p-4 transition-colors group-hover:border-brand-300 dark:group-hover:border-brand-700"
              >
                <div class="flex items-center justify-between gap-2">
                  <span class="font-medium text-foreground">{set.name}</span>
                  <ArrowRight
                    size={15}
                    class="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
                <SetProgressBar
                  mastered={c.mastered}
                  learning={c.learning}
                  total={c.total}
                  class="mt-3"
                />
                <p class="mt-2 text-xs text-muted-foreground tabular-nums">
                  {c.mastered} mastered · {c.learning} learning · {c.total} total
                </p>
              </Card>
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</section>

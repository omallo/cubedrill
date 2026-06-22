<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Shuffle,
    Play,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    Loader2,
    Copy,
    Check
  } from 'lucide-svelte';
  import { PageHeader, Card, Button, Badge } from '$lib/components';
  import SolutionPlayer from '$lib/components/cube/solution-player.svelte';
  import {
    solve,
    generateScramble,
    ollCandidates,
    pllCandidates,
    personalFirst,
    SCRAMBLE_OPTIONS,
    type ScrambleType,
    type Solution,
    type SolveTarget
  } from '$lib/solver';
  import { casesInSet } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { display } from '$lib/display.svelte';
  import { cn } from '$lib/utils/cn';

  const TARGETS: { id: SolveTarget; label: string }[] = [
    { id: 'cross', label: 'Cross' },
    { id: 'f2l', label: 'F2L' },
    { id: 'oll', label: 'OLL' },
    { id: 'full', label: 'Full' }
  ];

  let scrambleType = $state<ScrambleType>('full');
  let target = $state<SolveTarget>('full');
  let scramble = $state('');
  let solution = $state<Solution | null>(null);
  let activeStep = $state(0);
  let busy = $state(true);
  let copied = $state(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cube = $state<any>(null);

  // The set of last-layer cases the user is learning — the solver favours these
  // and the breakdown flags any step that falls back to the wider catalog.
  const learned = $derived.by(() => {
    // Rebuilt whenever personal status changes (read inside the derived); never
    // mutated in place, so a plain Set is fine here.
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const ids = new Set<string>();
    for (const id of ['oll-full', 'pll-full']) {
      for (const { case: c } of casesInSet(id)) {
        if (personal.caseStatus(c.id) !== 'not-learned') ids.add(c.id);
      }
    }
    return ids;
  });

  const steps = $derived(solution?.steps ?? []);
  const preMoves = $derived(
    steps
      .slice(0, activeStep)
      .map((s) => s.moves)
      .filter(Boolean)
      .join(' ')
  );
  const activeMoves = $derived(steps[activeStep]?.moves ?? '');

  async function generate() {
    busy = true;
    solution = null;
    try {
      scramble = await generateScramble(scrambleType);
      await runSolve();
    } finally {
      busy = false;
    }
  }

  async function runSolve() {
    if (!scramble) {
      solution = null;
      return;
    }
    solution = await solve(scramble, {
      target,
      ollCandidates: personalFirst(ollCandidates(), learned),
      pllCandidates: personalFirst(pllCandidates(), learned)
    });
    activeStep = 0;
  }

  async function setType(t: ScrambleType) {
    if (t === scrambleType) return;
    scrambleType = t;
    await generate();
  }

  async function setTarget(t: SolveTarget) {
    if (t === target) return;
    target = t;
    busy = true;
    try {
      await runSolve();
    } finally {
      busy = false;
    }
  }

  function selectStep(i: number) {
    activeStep = i;
  }

  function prev() {
    if (activeStep > 0) activeStep--;
  }
  function next() {
    if (activeStep < steps.length - 1) activeStep++;
  }

  function copyScramble() {
    navigator.clipboard?.writeText(scramble);
    copied = true;
    setTimeout(() => (copied = false), 1200);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement) return;
    switch (e.key) {
      case 'ArrowLeft':
        prev();
        break;
      case 'ArrowRight':
        next();
        break;
      case 'p':
        cube?.play();
        break;
      case 'r':
        cube?.reset();
        break;
      case 's':
        generate();
        break;
    }
  }

  onMount(generate);
</script>

<svelte:head><title>Solver · Cubedrill</title></svelte:head>
<svelte:window onkeydown={onKeydown} />

<PageHeader
  title="Solver"
  description="Generate a human-style solution built from the algorithms you're learning."
>
  {#snippet actions()}
    <Button onclick={generate} disabled={busy}>
      {#if busy}<Loader2 size={16} class="animate-spin" />{:else}<Shuffle size={16} />{/if}
      New scramble
    </Button>
  {/snippet}
</PageHeader>

<!-- Controls -->
<Card class="mb-6 p-4">
  <div class="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
    <div class="space-y-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="w-20 shrink-0 text-xs font-medium text-muted-foreground">Scramble</span>
        <div class="flex flex-wrap gap-1.5">
          {#each SCRAMBLE_OPTIONS as opt (opt.id)}
            <button
              type="button"
              title={opt.description}
              onclick={() => setType(opt.id)}
              class={cn(
                'cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors',
                scrambleType === opt.id
                  ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
                  : 'border-border text-muted-foreground hover:bg-accent'
              )}
            >
              {opt.label}
            </button>
          {/each}
        </div>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <span class="w-20 shrink-0 text-xs font-medium text-muted-foreground">Solve to</span>
        <div class="inline-flex rounded-lg border border-border p-0.5">
          {#each TARGETS as t (t.id)}
            <button
              type="button"
              onclick={() => setTarget(t.id)}
              class={cn(
                'cursor-pointer rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                target === t.id
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {t.label}
            </button>
          {/each}
        </div>
      </div>
    </div>
  </div>

  <!-- Scramble string -->
  <div class="mt-4 flex items-start gap-2 border-t border-border pt-3">
    <span class="mt-0.5 text-xs font-medium text-muted-foreground">Scramble</span>
    <code class="flex-1 font-mono text-sm break-words text-foreground">{scramble || '—'}</code>
    {#if scramble}
      <button
        type="button"
        title="Copy scramble"
        onclick={copyScramble}
        class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
      >
        {#if copied}<Check size={14} class="text-emerald-500" />{:else}<Copy size={14} />{/if}
      </button>
    {/if}
  </div>
</Card>

<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
  <!-- Cube -->
  <Card class="flex flex-col items-center p-6">
    {#if busy}
      <div class="flex aspect-square w-full max-w-[340px] items-center justify-center">
        <Loader2 size={28} class="animate-spin text-muted-foreground" />
      </div>
    {:else if solution}
      <div class="relative aspect-square w-full max-w-[340px]">
        <SolutionPlayer
          bind:this={cube}
          {scramble}
          {preMoves}
          {activeMoves}
          hintFacelets={display.hintFacelets}
        />
      </div>
      <div class="mt-4 flex items-center gap-1.5">
        <Button variant="outline" size="sm" onclick={prev} disabled={activeStep === 0}>
          <ChevronLeft size={15} /> Prev
        </Button>
        <Button variant="secondary" size="sm" onclick={() => cube?.play()}>
          <Play size={15} /> Play step
        </Button>
        <Button variant="ghost" size="sm" onclick={() => cube?.reset()}>
          <RotateCcw size={15} />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onclick={next}
          disabled={activeStep >= steps.length - 1}
        >
          Next <ChevronRight size={15} />
        </Button>
      </div>
      <p class="mt-3 font-mono text-sm text-foreground">{activeMoves || 'skip'}</p>
    {/if}
  </Card>

  <!-- Breakdown -->
  <Card class="p-5">
    <div class="mb-4 flex items-center justify-between">
      <h3 class="font-semibold text-foreground">Solution</h3>
      {#if solution}
        <span class="text-sm text-muted-foreground tabular-nums">{solution.moveCount} moves</span>
      {/if}
    </div>

    {#if solution}
      <ol class="space-y-1.5">
        {#each steps as step, i (i)}
          {@const notInSet = step.caseId && !learned.has(step.caseId)}
          <li>
            <button
              type="button"
              onclick={() => selectStep(i)}
              class={cn(
                'w-full cursor-pointer rounded-lg border px-3 py-2 text-left transition-colors',
                i === activeStep
                  ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-500/10'
                  : 'border-transparent hover:bg-accent'
              )}
            >
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-foreground">{step.label}</span>
                {#if step.caseName}
                  <Badge variant="brand">{step.caseName}</Badge>
                {/if}
                {#if step.slot}
                  <span class="font-mono text-[11px] text-muted-foreground">{step.slot}</span>
                {/if}
                <span class="ml-auto text-xs text-muted-foreground tabular-nums">
                  {step.skip ? 'skip' : `${step.moveCount}`}
                </span>
              </div>
              {#if step.moves}
                <div class="mt-1 font-mono text-xs break-words text-muted-foreground">
                  {step.moves}
                </div>
              {/if}
              {#if step.unresolved}
                <div class="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  Couldn't resolve from your set.
                </div>
              {:else if notInSet}
                <div class="mt-1 text-[11px] text-muted-foreground">not in your set yet</div>
              {/if}
            </button>
          </li>
        {/each}
      </ol>

      {#if !solution.complete}
        <p
          class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
        >
          Some phases couldn't be resolved from the catalog. The shown solution may be incomplete.
        </p>
      {/if}
    {:else if !busy}
      <p class="text-sm text-muted-foreground">Generate a scramble to see a solution.</p>
    {/if}
  </Card>
</div>

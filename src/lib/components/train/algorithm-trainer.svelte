<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import {
    Eye,
    Play,
    Timer,
    Box,
    RotateCcw,
    ArrowLeft,
    ArrowRight,
    Shuffle,
    Lightbulb,
    Boxes
  } from 'lucide-svelte';
  import { Button, Card, LearningStatusControl } from '$lib/components';
  // Imported directly (not via the barrel) so cubing.js stays out of the main bundle.
  import CubePlayer from '$lib/components/cube/cube-player.svelte';
  import { setupScramble } from '$lib/components/cube/orientation';
  import { getPhase, type Algorithm, type CaseInSet, type StickeringMask } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { cn } from '$lib/utils/cn';

  type Props = {
    /** The training pool, in the order it should be drilled. */
    pool: CaseInSet[];
  };

  let { pool }: Props = $props();

  // Snapshot the pool once: cycling a case's status during a session must not
  // resize/reorder the deck under the user (the page re-derives `pool` live).
  // Remounting on a filter change (keyed by the page) rebuilds this snapshot.
  const cases = untrack(() => pool);

  const maskToStickering: Record<StickeringMask, string> = {
    full: 'full',
    cross: 'Cross',
    f2l: 'F2L',
    'f2l-slot': 'F2L',
    oll: 'OLL',
    pll: 'full'
  };

  // Every case in a set shares a phase, so rendering config is constant here.
  const phase = cases[0] ? getPhase(cases[0].case.phaseId) : undefined;
  const stickering = phase ? maskToStickering[phase.mask] : 'full';
  const canToggleViz = (phase?.supportedVisualizations.length ?? 0) > 1;

  // --- Order & position -----------------------------------------------------
  let shuffled = $state(false);
  let order = $state<number[]>(cases.map((_, i) => i));
  let pos = $state(0);

  const current = $derived(cases[order[pos]]);
  const alg = $derived<Algorithm | undefined>(
    current?.case.algorithms.find((a) => a.primary) ?? current?.case.algorithms[0]
  );

  // Scramble to apply to a solved cube to reach the case — for practising on a
  // normal (non-smart) cube, where you otherwise can't get into the case to solve it.
  let scramble = $state('');
  $effect(() => {
    const m = alg?.moves;
    let cancelled = false;
    if (m) setupScramble(m).then((s) => !cancelled && (scramble = s));
    else scramble = '';
    return () => {
      cancelled = true;
    };
  });

  // --- Recognition / reveal -------------------------------------------------
  // Each case runs through three stages: `ready` (the gate — timer parked at 0 so
  // you can get set, or build the scramble on a normal cube, before timing starts),
  // `recognizing` (timer running, solution hidden) and `revealed` (solution shown,
  // timer stopped). Nothing auto-starts: you leave the gate on your own action.
  let stage = $state<'ready' | 'recognizing' | 'revealed'>('ready');
  let viz = $state<'2D' | '3D'>(phase?.defaultVisualization ?? '3D');
  let hint = $state(false);
  // Show the setup scramble (for practising on a normal, non-smart cube). Off by
  // default — recognition uses the on-screen cube as the prompt, not the scramble.
  let showScramble = $state(false);
  // bind:this on the custom-element-backed CubePlayer doesn't match its class type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cube = $state<any>(null);

  // --- Recognition timer (immediate feedback; not persisted yet) ------------
  let elapsed = $state(0);
  const running = $derived(stage === 'recognizing');
  const seconds = $derived((elapsed / 1000).toFixed(1));

  onMount(() => {
    const id = setInterval(() => {
      if (running) elapsed += 100;
    }, 100);
    startCase();
    return () => clearInterval(id);
  });

  /** Park on the current case at the ready gate: solution hidden, timer reset and stopped. */
  function startCase() {
    stage = 'ready';
    elapsed = 0;
    cube?.reset();
  }

  /** Leave the ready gate and start the recognition timer. */
  function begin() {
    if (stage === 'ready') stage = 'recognizing';
  }

  function reveal() {
    if (stage !== 'revealed') stage = 'revealed';
  }

  /** Space / Enter: walk the current case through ready → recognizing → revealed → next. */
  function advance() {
    if (stage === 'ready') begin();
    else if (stage === 'recognizing') reveal();
    else go(1);
  }

  function go(delta: number) {
    pos = (pos + delta + order.length) % order.length;
    startCase();
  }

  /** Toggle shuffle, keeping the current case in view as the new deck's head. */
  function toggleShuffle() {
    const cur = order[pos];
    shuffled = !shuffled;
    if (shuffled) {
      const rest = order.filter((i) => i !== cur);
      for (let i = rest.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [rest[i], rest[j]] = [rest[j], rest[i]];
      }
      order = [cur, ...rest];
    } else {
      order = cases.map((_, i) => i);
    }
    pos = order.indexOf(cur);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
    switch (e.key) {
      case ' ':
        e.preventDefault();
        advance();
        break;
      case 'ArrowRight':
        go(1);
        break;
      case 'ArrowLeft':
        go(-1);
        break;
      case 'Enter':
        advance();
        break;
      case 'p':
        cube?.play();
        break;
      case 'r':
        cube?.reset();
        break;
      case 'h':
        hint = !hint;
        break;
      case 'c':
        showScramble = !showScramble;
        break;
      case 's':
        toggleShuffle();
        break;
      case 'v':
        if (canToggleViz) viz = viz === '2D' ? '3D' : '2D';
        break;
      case 'm':
        if (current) personal.cycle(current.case.id);
        break;
    }
  }

  const toggleClass = (active: boolean) =>
    cn(
      'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-muted-foreground transition-colors',
      active
        ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
        : 'border-border hover:bg-accent'
    );
</script>

<svelte:window onkeydown={onKeydown} />

{#if cases.length === 0}
  <Card class="p-10 text-center text-sm text-muted-foreground">
    No cases match the selected filters. Adjust the filters above, then start training.
  </Card>
{:else if current}
  <div class="mx-auto flex max-w-sm flex-col items-center">
    <div class="mb-4 flex min-h-5 w-full items-center justify-center text-center text-sm">
      {#if showScramble && scramble}
        <span class="font-mono break-words text-foreground">{scramble}</span>
      {/if}
    </div>

    <div class="relative aspect-square w-full">
      <CubePlayer
        bind:this={cube}
        moves={alg?.moves ?? ''}
        {stickering}
        visualization={viz}
        hintFacelets={hint}
      />
      <span
        class="absolute top-2 left-2 rounded-md bg-surface/80 px-2 py-0.5 font-mono text-xs text-muted-foreground tabular-nums ring-1 ring-border backdrop-blur transition-opacity"
        class:opacity-50={stage === 'ready'}
      >
        {seconds}s
      </span>
    </div>

    <div class="mt-5 min-h-28 w-full text-center">
      {#if stage === 'revealed'}
        <div class="flex items-baseline justify-center gap-2">
          <span class="text-lg font-semibold text-foreground">{current.label}</span>
          {#if current.case.nickname}
            <span class="text-sm text-muted-foreground">{current.case.nickname}</span>
          {/if}
        </div>
        <div class="mt-1 font-mono text-sm break-words text-foreground">{alg?.moves}</div>
        <div class="mt-3 flex items-center justify-center gap-2">
          <Button variant="secondary" size="sm" onclick={() => cube?.play()}>
            <Play size={15} /> Play
          </Button>
          <Button variant="ghost" size="sm" onclick={() => cube?.reset()}>
            <RotateCcw size={15} /> Reset
          </Button>
          <LearningStatusControl
            status={personal.status(current.case.id)}
            oncycle={() => personal.cycle(current.case.id)}
          />
        </div>
      {:else if stage === 'recognizing'}
        <Button variant="primary" onclick={reveal}>
          <Eye size={16} /> Reveal solution
        </Button>
        <p class="mt-3 text-xs text-muted-foreground">
          Recall the algorithm, then reveal to check.
        </p>
      {:else}
        <Button variant="primary" onclick={begin}>
          <Timer size={16} /> Start
        </Button>
        <p class="mt-3 text-xs text-muted-foreground">
          {showScramble
            ? 'Apply the scramble to a solved cube, then start when ready.'
            : 'Recognize the case from the cube, then start to time your recall.'}
        </p>
      {/if}
    </div>

    <div class="mt-2 flex w-full items-center justify-between gap-2">
      <Button variant="outline" size="sm" onclick={() => go(-1)} aria-label="Previous case">
        <ArrowLeft size={15} /> Prev
      </Button>

      <div class="flex items-center gap-1.5">
        <button
          type="button"
          aria-pressed={shuffled}
          title="Shuffle (s)"
          onclick={toggleShuffle}
          class={toggleClass(shuffled)}
        >
          <Shuffle size={15} />
        </button>
        <button
          type="button"
          aria-pressed={hint}
          title="Hint facelets (h)"
          onclick={() => (hint = !hint)}
          class={toggleClass(hint)}
        >
          <Lightbulb size={15} />
        </button>
        <button
          type="button"
          aria-pressed={showScramble}
          title="Show setup scramble (c)"
          onclick={() => (showScramble = !showScramble)}
          class={toggleClass(showScramble)}
        >
          <Box size={15} />
        </button>
        {#if canToggleViz}
          <button
            type="button"
            aria-pressed={viz === '3D'}
            title="Toggle 2D / 3D (v)"
            onclick={() => (viz = viz === '2D' ? '3D' : '2D')}
            class={cn(toggleClass(viz === '3D'), 'w-auto px-2 text-xs font-semibold')}
          >
            <Boxes size={15} />
            {viz}
          </button>
        {/if}
      </div>

      <Button variant="primary" size="sm" onclick={() => go(1)} aria-label="Next case">
        Next <ArrowRight size={15} />
      </Button>
    </div>

    <p class="mt-6 text-center text-xs text-muted-foreground">
      <kbd class="font-sans">Space</kbd> start / reveal / next ·
      <kbd class="font-sans">←</kbd> <kbd class="font-sans">→</kbd> move ·
      <kbd class="font-sans">c</kbd> scramble · <kbd class="font-sans">m</kbd> mark
    </p>
  </div>
{/if}

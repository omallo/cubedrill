<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Shuffle, Loader2, X } from 'lucide-svelte';
  import { PageHeader, Card, Button, StatCard } from '$lib/components';
  import SolutionPlayer from '$lib/components/cube/solution-player.svelte';
  import { generateScramble, SCRAMBLE_OPTIONS, type ScrambleType } from '$lib/solver';
  import { solves, formatTime, effectiveMs, type Penalty } from '$lib/solves.svelte';
  import { display } from '$lib/display.svelte';
  import { cn } from '$lib/utils/cn';

  let scrambleType = $state<ScrambleType>('full');
  let scramble = $state('');
  let generating = $state(true);

  // Timer state machine: idle → arming (holding) → ready (held long enough) →
  // running → idle (on stop). Touch and Space share the same path.
  type Phase = 'idle' | 'arming' | 'ready' | 'running';
  let phase = $state<Phase>('idle');
  let elapsed = $state(0);
  let startedAt = 0;
  let raf = 0;
  let armTimer: ReturnType<typeof setTimeout> | undefined;
  const HOLD_MS = 300;

  const display_ms = $derived(phase === 'running' || elapsed ? elapsed : 0);

  async function newScramble() {
    generating = true;
    try {
      scramble = await generateScramble(scrambleType);
    } finally {
      generating = false;
    }
  }

  async function setType(t: ScrambleType) {
    if (t === scrambleType) return;
    scrambleType = t;
    await newScramble();
  }

  function tick() {
    elapsed = performance.now() - startedAt;
    raf = requestAnimationFrame(tick);
  }

  function startTimer() {
    phase = 'running';
    startedAt = performance.now();
    elapsed = 0;
    raf = requestAnimationFrame(tick);
  }

  function stopTimer() {
    cancelAnimationFrame(raf);
    phase = 'idle';
    elapsed = performance.now() - startedAt;
    solves.add({ ms: elapsed, penalty: 'none', scramble, scrambleType });
    newScramble();
  }

  // --- Input: hold to arm, release to start, press to stop ------------------
  function press() {
    if (phase === 'running') {
      stopTimer();
      return;
    }
    if (phase === 'idle') {
      phase = 'arming';
      armTimer = setTimeout(() => {
        if (phase === 'arming') phase = 'ready';
      }, HOLD_MS);
    }
  }

  function release() {
    if (phase === 'ready') {
      startTimer();
    } else if (phase === 'arming') {
      // Released too soon — treat as a tap, ignore (didn't hold long enough).
      clearTimeout(armTimer);
      phase = 'idle';
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLButtonElement) {
      if (e.key !== ' ') return;
    }
    if (e.key === ' ') {
      e.preventDefault();
      if (!e.repeat) press();
    } else if (e.key === 's' && phase === 'idle') {
      newScramble();
    } else if (phase === 'running') {
      // Any other key also stops the timer (common timer behaviour).
      stopTimer();
    }
  }

  function onKeyup(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault();
      release();
    }
  }

  function penalize(id: string, p: Penalty) {
    const current = solves.list.find((s) => s.id === id)?.penalty;
    solves.setPenalty(id, current === p ? 'none' : p);
  }

  onMount(newScramble);
  onDestroy(() => {
    cancelAnimationFrame(raf);
    clearTimeout(armTimer);
  });

  const timerColor = $derived(
    phase === 'ready'
      ? 'text-emerald-500'
      : phase === 'arming'
        ? 'text-amber-500'
        : 'text-foreground'
  );
</script>

<svelte:head><title>Solves · Cubedrill</title></svelte:head>
<svelte:window onkeydown={onKeydown} onkeyup={onKeyup} />

<PageHeader title="Solves" description="Practice full and partial solves with a timer.">
  {#snippet actions()}
    <Button variant="outline" onclick={newScramble} disabled={generating || phase === 'running'}>
      {#if generating}<Loader2 size={16} class="animate-spin" />{:else}<Shuffle size={16} />{/if}
      New scramble
    </Button>
  {/snippet}
</PageHeader>

<!-- Scramble type -->
<div class="mb-5 flex flex-wrap gap-1.5">
  {#each SCRAMBLE_OPTIONS as opt (opt.id)}
    <button
      type="button"
      title={opt.description}
      onclick={() => setType(opt.id)}
      disabled={phase === 'running'}
      class={cn(
        'cursor-pointer rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-50',
        scrambleType === opt.id
          ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
          : 'border-border text-muted-foreground hover:bg-accent'
      )}
    >
      {opt.label}
    </button>
  {/each}
</div>

<div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
  <div class="space-y-5">
    <!-- Scramble + timer surface -->
    <Card
      class="relative flex min-h-[360px] cursor-pointer touch-none flex-col items-center justify-center gap-6 p-8 select-none"
      onpointerdown={press}
      onpointerup={release}
    >
      <p
        class="absolute top-5 right-6 left-6 text-center font-mono text-sm break-words text-muted-foreground"
      >
        {scramble || '—'}
      </p>
      <div class={cn('font-mono text-7xl font-bold tabular-nums transition-colors', timerColor)}>
        {formatTime(display_ms)}
      </div>
      <p class="absolute bottom-5 text-xs text-muted-foreground">
        {#if phase === 'running'}
          Press any key to stop
        {:else}
          Hold <kbd class="rounded border border-border px-1">Space</kbd> (or touch), release to start
        {/if}
      </p>
    </Card>

    <!-- Cube preview -->
    <Card class="flex flex-col items-center p-6">
      <span
        class="mb-3 self-start text-xs font-medium tracking-wider text-muted-foreground uppercase"
      >
        Scramble preview
      </span>
      {#if generating}
        <div class="flex aspect-square w-full max-w-[240px] items-center justify-center">
          <Loader2 size={24} class="animate-spin text-muted-foreground" />
        </div>
      {:else}
        <div class="relative aspect-square w-full max-w-[240px]">
          <SolutionPlayer {scramble} hintFacelets={display.hintFacelets} />
        </div>
      {/if}
    </Card>
  </div>

  <!-- Stats + history -->
  <div class="space-y-5">
    <div class="grid grid-cols-2 gap-3">
      <StatCard label="Best" value={isFinite(solves.best) ? formatTime(solves.best) : '—'} />
      <StatCard label="Solves" value={solves.count} />
      <StatCard label="Ao5" value={isNaN(solves.ao5) ? '—' : formatTime(solves.ao5)} />
      <StatCard label="Ao12" value={isNaN(solves.ao12) ? '—' : formatTime(solves.ao12)} />
    </div>

    <Card class="p-5">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="font-semibold text-foreground">History</h3>
        {#if solves.count > 0}
          <button
            type="button"
            onclick={() => confirm('Clear all solves?') && solves.clear()}
            class="cursor-pointer text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            Clear
          </button>
        {/if}
      </div>

      {#if solves.count === 0}
        <p class="py-6 text-center text-sm text-muted-foreground">
          No solves yet. Hold space and release to start the timer.
        </p>
      {:else}
        <ul class="max-h-[28rem] space-y-1 overflow-y-auto">
          {#each solves.list as s, i (s.id)}
            <li class="group flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-accent">
              <span class="w-8 text-right font-mono text-xs text-muted-foreground tabular-nums">
                {solves.count - i}
              </span>
              <span
                class="font-mono text-sm font-medium tabular-nums"
                class:text-muted-foreground={s.penalty === 'dnf'}
              >
                {formatTime(effectiveMs(s))}
              </span>
              <div
                class="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <button
                  type="button"
                  title="+2 penalty"
                  onclick={() => penalize(s.id, '+2')}
                  class={cn(
                    'cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors',
                    s.penalty === '+2'
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                      : 'text-muted-foreground hover:bg-surface-muted'
                  )}
                >
                  +2
                </button>
                <button
                  type="button"
                  title="DNF"
                  onclick={() => penalize(s.id, 'dnf')}
                  class={cn(
                    'cursor-pointer rounded px-1.5 py-0.5 text-[11px] font-medium transition-colors',
                    s.penalty === 'dnf'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                      : 'text-muted-foreground hover:bg-surface-muted'
                  )}
                >
                  DNF
                </button>
                <button
                  type="button"
                  aria-label="Delete solve"
                  onclick={() => solves.remove(s.id)}
                  class="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-surface-muted hover:text-rose-500"
                >
                  <X size={13} />
                </button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </Card>
  </div>
</div>

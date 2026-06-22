<script lang="ts">
  import { onMount, untrack } from 'svelte';
  import { fly } from 'svelte/transition';
  import {
    Eye,
    Play,
    Timer,
    RotateCcw,
    ChevronLeft,
    ChevronRight,
    FlipHorizontal2,
    Check,
    Minus,
    X,
    Monitor,
    Box,
    Settings,
    ClipboardList
  } from 'lucide-svelte';
  import { Button, Card, LearningStatusControl } from '$lib/components';
  import { display } from '$lib/display.svelte';
  // Imported directly (not via the barrel) so cubing.js stays out of the main bundle.
  import CubePlayer from '$lib/components/cube/cube-player.svelte';
  import { setupScramble } from '$lib/components/cube/orientation';
  import {
    getPhase,
    primaryAlgorithm,
    type Algorithm,
    type CaseId,
    type CaseInSet,
    type F2LSlot,
    type LearningStatus,
    type StickeringMask
  } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { stats, avgMs, type RecallGrade } from '$lib/stats.svelte';
  import { cn } from '$lib/utils/cn';
  import type { IconComponent } from '$lib/types';

  /** A card to drill: a case in a set, plus the F2L slot it targets (if any). */
  type TrainingCard = CaseInSet & { slot?: F2LSlot };

  type Props = {
    /** The training pool, in the order it should be drilled. */
    pool: TrainingCard[];
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

  /** Tracking-unit key (per-slot for F2L, bare caseId otherwise) — matches the
   *  personal/stats stores so session entries line up with persisted state. */
  const unitKey = (caseId: CaseId, slot?: F2LSlot) => (slot ? `${caseId}:${slot}` : caseId);

  // Self-grade buttons shown on reveal. Grades are feedback only — they feed
  // recall stats and the session summary, and never change learning status on
  // their own (status stays user-controlled via the chips / session suggestions).
  const GRADES: {
    grade: RecallGrade;
    label: string;
    key: string;
    icon: IconComponent;
    cls: string;
    dot: string;
  }[] = [
    {
      grade: 'got',
      label: 'Got it',
      key: '1',
      icon: Check,
      cls: 'border-emerald-300 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-500/10',
      dot: 'bg-emerald-500'
    },
    {
      grade: 'hesitated',
      label: 'Hesitated',
      key: '2',
      icon: Minus,
      cls: 'border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-500/10',
      dot: 'bg-amber-500'
    },
    {
      grade: 'blanked',
      label: 'Blanked',
      key: '3',
      icon: X,
      cls: 'border-rose-300 text-rose-700 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-300 dark:hover:bg-rose-500/10',
      dot: 'bg-rose-500'
    }
  ];
  const gradeDot = (g: RecallGrade) => GRADES.find((x) => x.grade === g)!.dot;

  // --- Order & position -----------------------------------------------------
  let shuffled = $state(false);
  let order = $state<number[]>(cases.map((_, i) => i));
  let pos = $state(0);

  const current = $derived(cases[order[pos]]);
  const alg = $derived<Algorithm | undefined>(
    current ? primaryAlgorithm(current.case, current.slot) : undefined
  );
  const stat = $derived(current ? stats.get(current.case.id, current.slot) : undefined);

  // --- Recognition source (an Options setting, not a front-and-centre knob) --
  // Where you recognize the case from — independent of cube type:
  //  • 'screen' (default): the on-screen cube is the prompt; execute from what
  //    you see. No scramble needed.
  //  • 'cube': a setup scramble is shown so you build the case on your physical
  //    cube and recognize from it (more realistic; on a dumb cube, solving it
  //    cleanly is its own correctness check).
  let recognizeFrom = $state<'screen' | 'cube'>('screen');

  // Scramble to apply to a solved cube to reach the case. Only derived when
  // training from the cube (the kpuzzle work is wasted otherwise).
  let scramble = $state('');
  $effect(() => {
    const m = alg?.moves;
    if (recognizeFrom !== 'cube' || !m) {
      scramble = '';
      return;
    }
    let cancelled = false;
    setupScramble(m).then((s) => !cancelled && (scramble = s));
    return () => {
      cancelled = true;
    };
  });

  // --- Recall / reveal ------------------------------------------------------
  // A case runs through up to three stages. 'ready' is the untimed setup gate —
  // only used when recognizing from the cube, so the time spent applying the
  // scramble isn't counted. 'recalling' runs the timer (solution hidden), and
  // 'revealed' shows the solution + self-grade. From the screen there's nothing
  // to set up, so cases start straight in 'recalling'.
  let stage = $state<'ready' | 'recalling' | 'revealed'>('recalling');
  // Visualization + hint facelets come from the shared display store, so the
  // choice carries over to/from the list view.
  const viz = $derived(display.resolveViz(phase));
  // bind:this on the custom-element-backed CubePlayer doesn't match its class type.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cube = $state<any>(null);

  // --- Attempt timer (latency from start to reveal) -------------------------
  let elapsed = $state(0);
  const running = $derived(stage === 'recalling');
  const seconds = $derived((elapsed / 1000).toFixed(1));

  onMount(() => {
    const id = setInterval(() => {
      if (running) elapsed += 100;
    }, 100);
    startCase();
    return () => clearInterval(id);
  });

  /** Show the current case fresh: solution hidden, timer reset. Starts at the
   *  setup gate when recognizing from the cube, else straight into recall. */
  function startCase() {
    stage = recognizeFrom === 'cube' ? 'ready' : 'recalling';
    elapsed = 0;
    cube?.reset();
  }

  /** Leave the setup gate and start timing. */
  function begin() {
    if (stage === 'ready') stage = 'recalling';
  }

  function reveal() {
    if (stage !== 'revealed') stage = 'revealed';
  }

  /** Record the recall outcome for the current case, then advance. */
  function grade(g: RecallGrade) {
    if (stage !== 'revealed' || !current) return;
    stats.record(current.case.id, current.slot, g, elapsed);
    recordSession(current, g, elapsed);
    go(1);
  }

  /** Space / Enter: walk the case forward; on reveal, optimistically grade 'got'. */
  function advance() {
    if (stage === 'ready') begin();
    else if (stage === 'recalling') reveal();
    else grade('got');
  }

  /** Move by `delta` cases (wrapping) for browsing — no grade is recorded. */
  function go(delta: number) {
    pos = (pos + delta + order.length) % order.length;
    startCase();
  }

  // --- Options (recognition source, view, hint, shuffle) --------------------
  // Tucked into a popover so the training surface stays a simple loop; these are
  // tweaks most users set once (or never), not part of the moment-to-moment flow.
  let optionsOpen = $state(false);
  let optionsRoot = $state<HTMLElement | null>(null);

  function setRecognizeFrom(src: 'screen' | 'cube') {
    if (src === recognizeFrom) return;
    recognizeFrom = src;
    startCase();
  }

  function setViz(v: '2D' | '3D') {
    if (display.resolveViz(phase) !== v) display.toggleViz(phase);
  }

  function setHint(on: boolean) {
    if (on !== display.hintFacelets) display.toggleHint();
  }

  function setShuffle(on: boolean) {
    if (on === shuffled) return;
    const cur = order[pos];
    shuffled = on;
    if (on) {
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

  // --- Session summary ------------------------------------------------------
  // A live, in-memory log of what was drilled this session (ephemeral — it
  // resets when the trainer remounts on a filter change). Hidden by default and
  // revealed on demand, so it never competes with the cube for attention.
  type SessionEntry = {
    key: string;
    caseId: CaseId;
    slot?: F2LSlot;
    label: string;
    attempts: { grade: RecallGrade; ms: number }[];
  };
  let sessionEntries = $state<SessionEntry[]>([]);
  let showSession = $state(false);

  function recordSession(card: TrainingCard, grade: RecallGrade, ms: number) {
    const key = unitKey(card.case.id, card.slot);
    const existing = sessionEntries.find((e) => e.key === key);
    if (existing) existing.attempts.push({ grade, ms });
    else
      sessionEntries.push({
        key,
        caseId: card.case.id,
        slot: card.slot,
        label: card.label,
        attempts: [{ grade, ms }]
      });
  }

  /** A one-rung status nudge from this session's grades, or null if none fits.
   *  Climbs gently: not-learned → learning (no blanks), learning → mastered
   *  (all clean), and mastered → learning on any blank. Never auto-applied. */
  function suggestion(e: SessionEntry): { to: LearningStatus; label: string } | null {
    const grades = e.attempts.map((a) => a.grade);
    const allGot = grades.every((g) => g === 'got');
    const anyBlanked = grades.some((g) => g === 'blanked');
    const status = personal.status(e.caseId, e.slot);
    if (anyBlanked && status === 'mastered') return { to: 'learning', label: 'Move to Learning' };
    if (allGot && status === 'learning') return { to: 'mastered', label: 'Mark Mastered' };
    if (!anyBlanked && status === 'not-learned') return { to: 'learning', label: 'Mark Learning' };
    return null;
  }

  function applySuggestion(e: SessionEntry) {
    const s = suggestion(e);
    if (s) personal.setStatus(e.caseId, e.slot, s.to);
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) return;
    switch (e.key) {
      case 'Escape':
        optionsOpen = false;
        showSession = false;
        break;
      case ' ':
      case 'Enter':
        e.preventDefault();
        advance();
        break;
      case 'ArrowRight':
        go(1);
        break;
      case 'ArrowLeft':
        go(-1);
        break;
      case '1':
        grade('got');
        break;
      case '2':
        grade('hesitated');
        break;
      case '3':
        grade('blanked');
        break;
      case 'p':
        cube?.play();
        break;
      case 'r':
        cube?.reset();
        break;
      case 'h':
        display.toggleHint();
        break;
      case 's':
        setShuffle(!shuffled);
        break;
      case 't':
        showSession = !showSession;
        break;
      case 'v':
        if (display.canToggleViz(phase)) display.toggleViz(phase);
        break;
      case 'm':
        if (current) personal.cycle(current.case.id, current.slot);
        break;
    }
  }

  function onWindowClick(e: MouseEvent) {
    if (optionsOpen && optionsRoot && !optionsRoot.contains(e.target as Node)) optionsOpen = false;
  }

  const segBtn = (active: boolean) =>
    cn(
      'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
      active
        ? 'bg-primary text-primary-foreground'
        : 'cursor-pointer text-muted-foreground hover:text-foreground'
    );

  /** One choice in an Options popover segmented control. */
  type SegOption = {
    value: string;
    label: string;
    icon?: IconComponent;
    active: boolean;
    onclick: () => void;
  };

  const iconBtn = (active: boolean) =>
    cn(
      'relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border text-muted-foreground transition-colors',
      active
        ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700 dark:bg-brand-500/10 dark:text-brand-300'
        : 'border-border hover:bg-accent'
    );
</script>

<svelte:window onkeydown={onKeydown} onclick={onWindowClick} />

{#snippet segmented(label: string, options: SegOption[])}
  <div class="flex items-center justify-between gap-3">
    <span class="shrink-0 text-sm whitespace-nowrap text-foreground">{label}</span>
    <div class="inline-flex rounded-lg border border-border p-0.5">
      {#each options as o (o.value)}
        {@const Icon = o.icon}
        <button type="button" class={segBtn(o.active)} onclick={o.onclick}>
          {#if Icon}<Icon size={13} />{/if}
          {o.label}
        </button>
      {/each}
    </div>
  </div>
{/snippet}

{#if cases.length === 0}
  <Card class="p-10 text-center text-sm text-muted-foreground">
    No cases match the selected filters. Adjust the filters above, then start training.
  </Card>
{:else if current}
  <div class="mx-auto max-w-md">
    <Card class="p-6">
      <!-- Toolbar: position + the tucked-away surfaces (options, session) up top. -->
      <div class="mb-3 flex items-center gap-2">
        <div class="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous case"
            title="Previous (←)"
            onclick={() => go(-1)}
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronLeft size={16} />
          </button>
          <span class="min-w-14 text-center font-mono text-xs text-muted-foreground tabular-nums">
            {pos + 1} / {cases.length}
          </span>
          <button
            type="button"
            aria-label="Next case"
            title="Next (→)"
            onclick={() => go(1)}
            class="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <div class="ml-auto flex items-center gap-1.5">
          <div class="relative" bind:this={optionsRoot}>
            <button
              type="button"
              aria-pressed={optionsOpen}
              title="Options"
              onclick={() => (optionsOpen = !optionsOpen)}
              class={iconBtn(optionsOpen)}
            >
              <Settings size={15} />
            </button>
            {#if optionsOpen}
              <div
                transition:fly={{ y: -6, duration: 120 }}
                class="absolute top-full right-0 z-30 mt-2 w-72 space-y-3 rounded-xl border border-border bg-surface p-3 text-left shadow-lg"
              >
                {@render segmented('Recognize from', [
                  {
                    value: 'screen',
                    label: 'Screen',
                    icon: Monitor,
                    active: recognizeFrom === 'screen',
                    onclick: () => setRecognizeFrom('screen')
                  },
                  {
                    value: 'cube',
                    label: 'Cube',
                    icon: Box,
                    active: recognizeFrom === 'cube',
                    onclick: () => setRecognizeFrom('cube')
                  }
                ])}
                {#if display.canToggleViz(phase)}
                  {@render segmented('View', [
                    { value: '2D', label: '2D', active: viz === '2D', onclick: () => setViz('2D') },
                    { value: '3D', label: '3D', active: viz === '3D', onclick: () => setViz('3D') }
                  ])}
                {/if}
                {@render segmented('Hint facelets', [
                  {
                    value: 'off',
                    label: 'Off',
                    active: !display.hintFacelets,
                    onclick: () => setHint(false)
                  },
                  {
                    value: 'on',
                    label: 'On',
                    active: display.hintFacelets,
                    onclick: () => setHint(true)
                  }
                ])}
                {@render segmented('Shuffle order', [
                  {
                    value: 'off',
                    label: 'Off',
                    active: !shuffled,
                    onclick: () => setShuffle(false)
                  },
                  { value: 'on', label: 'On', active: shuffled, onclick: () => setShuffle(true) }
                ])}
              </div>
            {/if}
          </div>

          <button
            type="button"
            aria-pressed={showSession}
            title="Session summary (t)"
            onclick={() => (showSession = !showSession)}
            class={iconBtn(showSession)}
          >
            <ClipboardList size={15} />
            {#if sessionEntries.length}
              <span
                class="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-semibold text-white"
              >
                {sessionEntries.length}
              </span>
            {/if}
          </button>
        </div>
      </div>

      <!-- Scramble (cube-recognition only) sits right above the cube it sets up. -->
      <div class="flex min-h-5 items-center justify-center text-center text-sm">
        {#if recognizeFrom === 'cube' && scramble}
          <span class="font-mono break-words text-foreground">{scramble}</span>
        {/if}
      </div>

      <div class="relative mx-auto mt-2 aspect-square w-full max-w-[260px]">
        <CubePlayer
          bind:this={cube}
          moves={alg?.moves ?? ''}
          {stickering}
          visualization={viz}
          hintFacelets={display.hintFacelets}
        />
      </div>

      <div class="mt-3 flex justify-center">
        <span
          class="rounded-md bg-surface-muted px-2 py-0.5 font-mono text-xs text-muted-foreground tabular-nums transition-opacity"
          class:opacity-60={stage !== 'recalling'}
        >
          {seconds}s
        </span>
      </div>

      <!-- Action / answer. Reserved height so revealing swaps content in place
           rather than pushing the cube and nav around. -->
      <div class="flex min-h-52 flex-col items-center justify-center text-center">
        {#if stage === 'revealed'}
          <div class="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
            <span class="text-lg font-semibold text-foreground">{current.label}</span>
            {#if current.slot}
              <span
                class="rounded bg-surface-muted px-1.5 py-0.5 font-mono text-[11px] font-medium text-muted-foreground"
                title={`Slot ${current.slot}`}>{current.slot}</span
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
            {#if current.case.nickname}
              <span class="text-sm text-muted-foreground">{current.case.nickname}</span>
            {/if}
          </div>
          <div class="mt-1 font-mono text-sm break-words text-foreground">{alg?.moves}</div>

          <!-- Primary next step: how did the recall go? -->
          <div class="mt-4 flex items-center justify-center gap-2">
            {#each GRADES as g (g.grade)}
              {@const Icon = g.icon}
              <button
                type="button"
                title={`${g.label} (${g.key})`}
                onclick={() => grade(g.grade)}
                class={cn(
                  'inline-flex cursor-pointer items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                  g.cls
                )}
              >
                <Icon size={15} />
                {g.label}
              </button>
            {/each}
          </div>

          <!-- Secondary: replay, reset, manual status override -->
          <div class="mt-3 flex items-center justify-center gap-1.5 text-muted-foreground">
            <Button variant="ghost" size="sm" onclick={() => cube?.play()}>
              <Play size={15} /> Play
            </Button>
            <Button variant="ghost" size="sm" onclick={() => cube?.reset()}>
              <RotateCcw size={15} /> Reset
            </Button>
            <LearningStatusControl
              status={personal.status(current.case.id, current.slot)}
              oncycle={() => personal.cycle(current.case.id, current.slot)}
            />
          </div>

          {#if stat}
            <p class="mt-3 text-xs text-muted-foreground tabular-nums">
              {#if stat.streak > 0}
                <span class="font-medium text-emerald-600 dark:text-emerald-400"
                  >{stat.streak} in a row</span
                >
                ·
              {/if}
              avg {(avgMs(stat) / 1000).toFixed(1)}s{#if stat.bestMs}
                · best {(stat.bestMs / 1000).toFixed(1)}s{/if}
            </p>
          {/if}
        {:else if stage === 'recalling'}
          <Button variant="primary" onclick={reveal}>
            <Eye size={16} /> Reveal solution
          </Button>
          <p class="mt-3 max-w-xs text-xs text-muted-foreground">
            {recognizeFrom === 'cube'
              ? 'Recognize from your cube and solve, then reveal to check.'
              : 'Recall the algorithm, then reveal to check.'}
          </p>
        {:else}
          <Button variant="primary" onclick={begin}>
            <Timer size={16} /> Start
          </Button>
          <p class="mt-3 max-w-xs text-xs text-muted-foreground">
            Apply the scramble to a solved cube, then start when ready.
          </p>
        {/if}
      </div>
    </Card>
  </div>

  {#if showSession}
    <aside
      transition:fly={{ x: 320, duration: 200 }}
      class="fixed top-0 right-0 z-40 flex h-full w-80 max-w-[85vw] flex-col border-l border-border bg-surface shadow-2xl"
    >
      <div class="flex items-center gap-2 border-b border-border px-4 py-3">
        <ClipboardList size={16} class="text-muted-foreground" />
        <h3 class="text-sm font-semibold text-foreground">This session</h3>
        <span class="text-xs text-muted-foreground">
          {sessionEntries.length}
          {sessionEntries.length === 1 ? 'case' : 'cases'}
        </span>
        <button
          type="button"
          aria-label="Close session summary"
          onclick={() => (showSession = false)}
          class="ml-auto flex h-7 w-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>

      <div class="min-h-0 flex-1 overflow-y-auto">
        {#if sessionEntries.length === 0}
          <p class="px-4 py-8 text-center text-sm text-muted-foreground">
            No cases graded yet. Grade a case and it shows up here with a suggested next step.
          </p>
        {:else}
          <ul class="divide-y divide-border">
            {#each sessionEntries as e (e.key)}
              {@const best = Math.min(...e.attempts.map((a) => a.ms))}
              {@const sug = suggestion(e)}
              <li class="px-4 py-3">
                <div class="flex items-baseline gap-2">
                  <span class="font-medium text-foreground">{e.label}</span>
                  {#if e.slot}
                    <span
                      class="rounded bg-surface-muted px-1 py-0.5 font-mono text-[10px] font-medium text-muted-foreground"
                      >{e.slot}</span
                    >
                  {/if}
                  <span class="ml-auto flex items-center gap-1">
                    {#each e.attempts as a, i (i)}
                      <span class={cn('h-2 w-2 rounded-full', gradeDot(a.grade))}></span>
                    {/each}
                  </span>
                </div>
                <div
                  class="mt-1 flex items-center gap-2 text-xs text-muted-foreground tabular-nums"
                >
                  <span>{e.attempts.length} {e.attempts.length === 1 ? 'rep' : 'reps'}</span>
                  <span>· best {(best / 1000).toFixed(1)}s</span>
                  {#if sug}
                    <button
                      type="button"
                      onclick={() => applySuggestion(e)}
                      class="ml-auto cursor-pointer rounded-md border border-brand-300 px-2 py-0.5 text-[11px] font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:border-brand-700 dark:text-brand-300 dark:hover:bg-brand-500/10"
                    >
                      {sug.label}
                    </button>
                  {/if}
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </aside>
  {/if}
{/if}

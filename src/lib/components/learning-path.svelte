<script lang="ts">
  import {
    Check,
    Layers,
    Milestone,
    PartyPopper,
    ChevronDown,
    ChevronRight,
    Dumbbell,
    List
  } from 'lucide-svelte';
  // Direct imports (not the '$lib/components' barrel) — this component is itself
  // re-exported from that barrel, so importing it back in would be a cycle.
  import { Card, Badge, Button } from '$lib/components/ui';
  import SetProgressBar from './set-progress-bar.svelte';
  import {
    cfopLearningPath,
    learnNext,
    coverageStepGroups,
    casesInSet,
    getSet,
    getCase,
    type CoverageStep,
    type NextDrill
  } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { cn } from '$lib/utils/cn';

  const status = (id: string, slot?: 'FR' | 'FL' | 'BR' | 'BL') => personal.status(id, slot);
  // Reactive: reads personal.status, so cycling a case re-derives the whole path.
  const progress = $derived(learnNext(cfopLearningPath, status));

  // Whole-card collapse (default: collapsed → just the next thing to do).
  let expanded = $state(false);
  // Per-stage expansion (groups / items). Current stage defaults open when shown.
  let openStages = $state<Record<string, boolean>>({});
  const stageOpen = (id: string, current: boolean) => openStages[id] ?? current;
  function toggleStage(id: string, current: boolean) {
    openStages = { ...openStages, [id]: !stageOpen(id, current) };
  }

  /** Deep-link into a set's page; `train` opens the trainer, else the list view. */
  function setHref(step: CoverageStep, opts: { train?: boolean; groupId?: string } = {}): string {
    const params: string[] = [];
    if (opts.train) params.push('mode=train');
    if (opts.groupId) params.push(`group=${encodeURIComponent(opts.groupId)}`);
    // FR is the set page's default slot (param omitted); only BR needs to be explicit.
    if (step.slot && step.slot !== 'FR') params.push(`slot=${step.slot}`);
    return `/algorithms/${step.setId}${params.length ? `?${params.join('&')}` : ''}`;
  }

  /** The next thing to do: the coverage step + its group/case labels, or null. */
  const next = $derived.by(() => {
    const d: NextDrill | null = progress.nextDrill;
    if (!d) return null;
    const step = progress.steps.find((s) => s.step.id === d.stepId)?.step;
    if (!step || step.kind !== 'coverage') return null;
    const groupName = d.groupId
      ? getSet(d.setId)?.groups.find((g) => g.id === d.groupId)?.name
      : undefined;
    const inSet = casesInSet(d.setId).find((c) => c.case.id === d.caseId);
    const caseLabel = inSet?.label ?? getCase(d.caseId)?.name ?? d.caseId;
    return { drill: d, step, groupName, caseLabel };
  });

  function nodeClasses(state: string, current: boolean): string {
    if (state === 'complete') return 'border-emerald-500 bg-emerald-500 text-white';
    if (current)
      return 'border-brand-500 bg-brand-500 text-white ring-4 ring-brand-100 dark:ring-brand-500/25';
    if (state === 'in-progress')
      return 'border-amber-500 bg-background text-amber-600 dark:text-amber-400';
    return 'border-border bg-background text-muted-foreground';
  }
</script>

{#snippet drillLinks(step: CoverageStep, groupId: string | undefined, size: 'sm' | 'md')}
  <Button href={setHref(step, { train: true, groupId })} {size}>
    <Dumbbell size={15} /> Train
  </Button>
  <Button href={setHref(step, { groupId })} {size} variant="outline">
    <List size={15} /> List
  </Button>
{/snippet}

<Card class="p-6">
  <!-- Header: title + whole-card expand/collapse -->
  <button
    type="button"
    class="flex w-full cursor-pointer items-center justify-between gap-3 text-left"
    onclick={() => (expanded = !expanded)}
    aria-expanded={expanded}
  >
    <div>
      <h3 class="font-semibold text-foreground">Your learning path</h3>
      <p class="mt-0.5 text-sm text-muted-foreground">
        A suggested order to build your CFOP repertoire.
      </p>
    </div>
    <span class="flex items-center gap-1 text-sm text-muted-foreground">
      {expanded ? 'Hide' : 'Show all'}
      <ChevronDown size={16} class={cn('transition-transform', expanded && 'rotate-180')} />
    </span>
  </button>

  {#if !expanded}
    <!-- Collapsed: just the next thing to do -->
    {#if next}
      <div
        class="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-surface-muted/50 p-3"
      >
        <div class="min-w-0">
          <p class="text-xs font-medium tracking-wide text-muted-foreground uppercase">Up next</p>
          <p class="mt-0.5 truncate font-semibold text-foreground">
            {next.step.label}
            {#if next.groupName}
              <span class="font-normal text-muted-foreground">· {next.groupName}</span>
            {/if}
          </p>
        </div>
        <div class="flex shrink-0 gap-2">
          {@render drillLinks(next.step, next.drill.groupId, 'sm')}
        </div>
      </div>
    {:else}
      <div
        class="mt-4 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
      >
        <PartyPopper size={16} />
        Full CFOP repertoire mastered — nice work!
      </div>
    {/if}
  {:else}
    <!-- Expanded: the full stepper -->
    <ol class="relative mt-5">
      {#each progress.steps as sp, i (sp.step.id)}
        {@const step = sp.step}
        {@const isCurrent = i === progress.currentStepIndex}
        {@const isLast = i === progress.steps.length - 1}
        {@const open = stageOpen(step.id, isCurrent)}
        {@const Icon =
          sp.state === 'complete' ? Check : step.kind === 'milestone' ? Milestone : Layers}
        {@const isNext = step.kind === 'coverage' && next?.step.id === step.id}
        <li class="relative flex gap-4">
          <!-- connector rail (masked behind each node) -->
          {#if !isLast}
            <span
              class="absolute top-0 bottom-0 left-4 w-px -translate-x-1/2 bg-border"
              aria-hidden="true"
            ></span>
          {/if}

          <!-- node -->
          <span
            class={cn(
              'relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border',
              nodeClasses(sp.state, isCurrent)
            )}
          >
            <Icon size={16} />
          </span>

          <!-- content -->
          <div class={cn('min-w-0 flex-1', isLast ? 'pb-0' : 'pb-7')}>
            <!-- stage header row (the whole row toggles substeps) -->
            <button
              type="button"
              class="group flex w-full cursor-pointer items-start gap-2 text-left"
              onclick={() => toggleStage(step.id, isCurrent)}
              aria-expanded={open}
            >
              <span class="mt-1 shrink-0 text-muted-foreground">
                {#if open}
                  <ChevronDown size={15} />
                {:else}
                  <ChevronRight size={15} />
                {/if}
              </span>
              <span class="min-w-0 flex-1">
                <span class="flex flex-wrap items-center gap-2">
                  <span class="font-semibold text-foreground">{step.label}</span>
                  {#if step.kind === 'milestone'}
                    <Badge variant="outline">technique</Badge>
                  {/if}
                  {#if isCurrent}
                    <Badge variant="brand">Current</Badge>
                  {/if}
                  {#if step.kind === 'coverage'}
                    <span class="text-sm text-muted-foreground">
                      {sp.mastered}/{sp.total} mastered
                    </span>
                  {/if}
                </span>
                {#if step.kind === 'coverage'}
                  <SetProgressBar
                    mastered={sp.mastered}
                    learning={sp.learning}
                    total={sp.total}
                    class="mt-2 max-w-md"
                  />
                {:else if step.description}
                  <span class="mt-1 block max-w-md text-sm text-muted-foreground">
                    {step.description}
                  </span>
                {/if}
              </span>
            </button>

            <!-- substeps -->
            {#if open}
              <div class="mt-3 ml-[1.4rem]">
                {#if step.kind === 'milestone'}
                  {#if step.items?.length}
                    <ul class="space-y-1.5">
                      {#each step.items as item (item.id)}
                        <li class="text-sm">
                          <span class="font-medium text-foreground">{item.label}</span>
                          {#if item.description}
                            <span class="text-muted-foreground"> — {item.description}</span>
                          {/if}
                        </li>
                      {/each}
                    </ul>
                  {/if}
                {:else}
                  <ul class="space-y-2">
                    {#each coverageStepGroups(step, status) as g (g.group?.id ?? '_ungrouped')}
                      <li>
                        <a
                          href={setHref(step, { groupId: g.group?.id })}
                          class={cn(
                            'flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-accent',
                            g.group?.id === next?.drill.groupId &&
                              'bg-brand-50/60 dark:bg-brand-500/10'
                          )}
                        >
                          <span class="min-w-0 flex-1 truncate text-sm text-foreground">
                            {g.group?.name ?? 'Cases'}
                          </span>
                          <SetProgressBar
                            mastered={g.mastered}
                            learning={g.learning}
                            total={g.total}
                            class="w-20 shrink-0"
                          />
                          <span class="w-12 shrink-0 text-right text-xs text-muted-foreground">
                            {g.mastered}/{g.total}
                          </span>
                        </a>
                      </li>
                    {/each}
                  </ul>
                {/if}

                <!-- the current stage: Train / List entry points -->
                {#if isNext && next}
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <span class="text-sm text-muted-foreground">
                      Up next:
                      {#if next.groupName}
                        <span class="font-medium text-foreground">{next.groupName}</span> ·
                      {/if}
                      <span class="font-medium text-foreground">{next.caseLabel}</span>
                    </span>
                    <span class="ml-auto flex gap-2">
                      {@render drillLinks(step, next.drill.groupId, 'sm')}
                    </span>
                  </div>
                {/if}
              </div>
            {/if}
          </div>
        </li>
      {/each}
    </ol>
  {/if}
</Card>

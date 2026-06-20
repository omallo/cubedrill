<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import { PageHeader, Card, Badge, SetProgressBar } from '$lib/components';
  import { catalog, getPhase, setsForPhase, casesInSet } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';

  // CFOP phases in solve order, each with its sets.
  const method = catalog.methods[0];
  const phases = method.phaseIds.map((id) => getPhase(id)).filter((p) => p !== undefined);
</script>

<svelte:head><title>Algorithms · Cubedrill</title></svelte:head>

<PageHeader
  title="Algorithms"
  description="Browse the built-in sets, pick what to learn, and drill them."
/>

<div class="space-y-8">
  {#each phases as phase (phase.id)}
    {@const sets = setsForPhase(phase.id)}
    <section>
      <div class="mb-3 flex items-baseline gap-2">
        <h3 class="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          {phase.name}
        </h3>
        {#if phase.fullName}
          <span class="text-xs text-muted-foreground">{phase.fullName}</span>
        {/if}
      </div>

      {#if sets.length === 0}
        <p class="text-sm text-muted-foreground">Coming soon.</p>
      {:else}
        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {#each sets as set (set.id)}
            {@const ids = casesInSet(set.id).map((c) => c.case.id)}
            {@const mastered = personal.count(ids, 'mastered')}
            {@const learning = personal.count(ids, 'learning')}
            <a href="/algorithms/{set.id}" class="group rounded-xl">
              <Card
                class="flex h-full flex-col p-5 transition-colors group-hover:border-brand-300 dark:group-hover:border-brand-700"
              >
                <div class="flex items-center justify-between gap-2">
                  <p class="font-semibold text-foreground">{set.name}</p>
                  {#if set.tier}
                    <Badge variant="outline">{set.tier}</Badge>
                  {/if}
                </div>
                {#if set.description}
                  <p class="mt-1 text-sm text-muted-foreground">{set.description}</p>
                {/if}
                <div class="mt-auto space-y-1.5 pt-4">
                  <SetProgressBar {mastered} {learning} total={ids.length} />
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">
                      <span class="font-semibold text-emerald-600 dark:text-emerald-400">
                        {mastered}
                      </span>
                      / {ids.length} mastered
                    </span>
                    <ArrowRight
                      size={15}
                      class="text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400"
                    />
                  </div>
                </div>
              </Card>
            </a>
          {/each}
        </div>
      {/if}
    </section>
  {/each}
</div>

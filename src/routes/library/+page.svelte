<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import { PageHeader, Card, Badge } from '$lib/components';
  import { catalog, getPhase, setsForPhase, casesInSet } from '$lib/domain';

  // CFOP phases in solve order, each with its sets.
  const method = catalog.methods[0];
  const phases = method.phaseIds.map((id) => getPhase(id)).filter((p) => p !== undefined);
</script>

<svelte:head><title>Library · Cubedrill</title></svelte:head>

<PageHeader
  title="Library"
  description="Browse the built-in algorithm sets and pick what to learn."
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
            {@const count = casesInSet(set.id).length}
            <a href="/library/{set.id}" class="group rounded-xl">
              <Card
                class="h-full p-5 transition-colors group-hover:border-brand-300 dark:group-hover:border-brand-700"
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
                <div
                  class="mt-4 flex items-center gap-1 text-sm font-medium text-brand-600 dark:text-brand-400"
                >
                  {count} cases
                  <ArrowRight
                    size={15}
                    class="opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </div>
              </Card>
            </a>
          {/each}
        </div>
      {/if}
    </section>
  {/each}
</div>

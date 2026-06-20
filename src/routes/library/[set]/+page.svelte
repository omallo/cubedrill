<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import { page } from '$app/state';
  import { PageHeader, Card } from '$lib/components';
  import { CaseDiagram } from '$lib/components/cube';
  import { getSet, casesInSet, type Algorithm } from '$lib/domain';

  const set = $derived(getSet(page.params.set ?? ''));
  const cases = $derived(set ? casesInSet(set.id) : []);

  const primaryAlg = (algorithms: Algorithm[]): Algorithm | undefined =>
    algorithms.find((a) => a.primary) ?? algorithms[0];
</script>

<svelte:head><title>{set?.name ?? 'Library'} · Cubedrill</title></svelte:head>

<a
  href="/library"
  class="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
>
  <ArrowLeft size={15} />
  Library
</a>

{#if !set}
  <p class="text-muted-foreground">Set not found.</p>
{:else}
  <PageHeader title={set.name} description={set.description} />

  <Card class="divide-y divide-border">
    {#each cases as entry (entry.case.id)}
      {@const alg = primaryAlg(entry.case.algorithms)}
      <div class="flex items-center gap-4 p-4">
        <CaseDiagram moves={alg?.moves ?? ''} phaseId={entry.case.phaseId} class="w-24 shrink-0" />
        <div class="min-w-0 flex-1">
          <div class="flex items-baseline gap-2">
            <span class="font-semibold text-foreground">{entry.label}</span>
            {#if entry.case.nickname}
              <span class="text-sm text-muted-foreground">{entry.case.nickname}</span>
            {/if}
          </div>
          <div class="mt-1 font-mono text-sm break-words text-muted-foreground">{alg?.moves}</div>
        </div>
      </div>
    {/each}
  </Card>
{/if}

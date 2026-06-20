<script lang="ts">
  import { ArrowLeft } from 'lucide-svelte';
  import { page } from '$app/state';
  import { PageHeader, Card, Badge, LearningStatusControl } from '$lib/components';
  import { CaseDiagram } from '$lib/components/cube';
  import { getSet, caseGroupsInSet, type Algorithm } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';

  const set = $derived(getSet(page.params.set ?? ''));
  const groups = $derived(set ? caseGroupsInSet(set.id) : []);
  const caseIds = $derived(groups.flatMap((g) => g.cases.map((c) => c.case.id)));
  const totalCases = $derived(caseIds.length);
  const masteredCount = $derived(personal.count(caseIds, 'mastered'));
  const learningCount = $derived(personal.count(caseIds, 'learning'));

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
  <PageHeader title={set.name} description={set.description}>
    {#snippet actions()}
      <span class="text-sm text-muted-foreground">
        <span class="font-semibold text-emerald-600 dark:text-emerald-400">{masteredCount}</span>
        mastered ·
        <span class="font-semibold text-amber-600 dark:text-amber-400">{learningCount}</span>
        learning
      </span>
      <Badge variant="outline">{totalCases} cases</Badge>
    {/snippet}
  </PageHeader>

  <div class="space-y-8">
    {#each groups as section (section.group?.id ?? '_ungrouped')}
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
            {@const alg = primaryAlg(entry.case.algorithms)}
            <div class="flex items-center gap-4 p-4">
              <CaseDiagram
                moves={alg?.moves ?? ''}
                phaseId={entry.case.phaseId}
                class="w-24 shrink-0"
              />
              <div class="min-w-0 flex-1">
                <div class="flex items-baseline gap-2">
                  <span class="font-semibold text-foreground">{entry.label}</span>
                  {#if entry.case.nickname}
                    <span class="text-sm text-muted-foreground">{entry.case.nickname}</span>
                  {/if}
                </div>
                <div class="mt-1 font-mono text-sm break-words text-muted-foreground">
                  {alg?.moves}
                </div>
              </div>
              <LearningStatusControl
                status={personal.status(entry.case.id)}
                oncycle={() => personal.cycle(entry.case.id)}
                class="shrink-0"
              />
            </div>
          {/each}
        </Card>
      </section>
    {/each}
  </div>
{/if}

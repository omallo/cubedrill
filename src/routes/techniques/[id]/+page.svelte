<script lang="ts">
  import { ArrowLeft, ArrowRight } from 'lucide-svelte';
  import { page } from '$app/state';
  import { PageHeader, Card, Button } from '$lib/components';
  import { getTechnique, getPhase } from '$lib/domain';

  const technique = $derived(getTechnique(page.params.id ?? ''));
  const phase = $derived(technique ? getPhase(technique.phaseId) : undefined);
</script>

<svelte:head><title>{technique?.name ?? 'Technique'} · Cubedrill</title></svelte:head>

<a
  href="/techniques"
  class="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
>
  <ArrowLeft size={15} />
  Techniques
</a>

{#if !technique}
  <p class="text-muted-foreground">Technique not found.</p>
{:else}
  <PageHeader title={technique.name} description={technique.description}>
    {#snippet actions()}
      {#if phase}
        <span class="text-sm font-medium tracking-wide text-muted-foreground uppercase">
          {phase.name}
        </span>
      {/if}
    {/snippet}
  </PageHeader>

  <ol class="space-y-4">
    {#each technique.sections as section, i (section.id)}
      <li id={section.id} class="scroll-mt-20">
        <Card class="p-5">
          <div class="flex items-baseline gap-3">
            <span
              class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-xs font-semibold text-brand-600 dark:bg-brand-950 dark:text-brand-400"
            >
              {i + 1}
            </span>
            <h2 class="font-semibold text-foreground">{section.name}</h2>
          </div>
          {#if section.description}
            <p class="mt-2 ml-9 text-sm text-muted-foreground">{section.description}</p>
          {/if}

          <!-- Bridge from intuitive F2L to the algorithmic set. -->
          {#if technique.id === 'intuitive-f2l' && section.id === 'next'}
            <div class="mt-3 ml-9">
              <Button href="/algorithms/f2l-standard" size="sm" variant="outline">
                Standard F2L algorithms
                <ArrowRight size={15} />
              </Button>
            </div>
          {/if}
        </Card>
      </li>
    {/each}
  </ol>

  <p class="mt-6 text-sm text-muted-foreground">
    More detailed walkthroughs for each section are coming soon.
  </p>
{/if}

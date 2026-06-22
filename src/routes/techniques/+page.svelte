<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import { PageHeader, Card } from '$lib/components';
  import { techniques, getPhase } from '$lib/domain';
</script>

<svelte:head><title>Techniques · Cubedrill</title></svelte:head>

<PageHeader
  title="Techniques"
  description="The conceptual phases of CFOP — learned by understanding, not memorized algorithms."
/>

<div class="grid gap-4 sm:grid-cols-2">
  {#each techniques as technique (technique.id)}
    {@const phase = getPhase(technique.phaseId)}
    <a href="/techniques/{technique.id}" class="group rounded-xl">
      <Card
        class="flex h-full flex-col p-5 transition-colors group-hover:border-brand-300 dark:group-hover:border-brand-700"
      >
        <div class="flex items-center justify-between gap-2">
          <p class="font-semibold text-foreground">{technique.name}</p>
          {#if phase}
            <span class="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {phase.name}
            </span>
          {/if}
        </div>
        {#if technique.description}
          <p class="mt-1 text-sm text-muted-foreground">{technique.description}</p>
        {/if}
        <div class="mt-auto flex items-center justify-between pt-4 text-sm">
          <span class="text-muted-foreground">{technique.sections.length} sections</span>
          <ArrowRight
            size={15}
            class="text-brand-600 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-400"
          />
        </div>
      </Card>
    </a>
  {/each}
</div>

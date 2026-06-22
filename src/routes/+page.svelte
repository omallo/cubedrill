<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import { PageHeader, Card, Button, LearningPath } from '$lib/components';
  import { primaryNav } from '$lib/config/navigation';

  // Quick-start tiles reuse the "Practice" section from the nav config.
  const quickStart = primaryNav.find((s) => s.title === 'Practice')?.items ?? [];
</script>

<svelte:head>
  <title>Dashboard · Cubedrill</title>
</svelte:head>

<PageHeader title="Welcome back" description="Pick up your algorithm journey where you left off.">
  {#snippet actions()}
    <Button href="/algorithms">
      Browse algorithms
      <ArrowRight size={16} />
    </Button>
  {/snippet}
</PageHeader>

<!-- Learning path — the dashboard centerpiece -->
<LearningPath />

<!-- Quick start -->
<section class="mt-8">
  <h3 class="mb-4 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
    Quick start
  </h3>
  <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {#each quickStart as item (item.href)}
      {@const Icon = item.icon}
      <a href={item.href} class="group rounded-xl">
        <Card
          class="h-full p-5 transition-colors group-hover:border-brand-300 dark:group-hover:border-brand-700"
        >
          <div
            class="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400"
          >
            <Icon size={20} />
          </div>
          <p class="flex items-center gap-1 font-semibold text-foreground">
            {item.label}
            <ArrowRight size={15} class="opacity-0 transition-opacity group-hover:opacity-100" />
          </p>
          <p class="mt-1 text-sm text-muted-foreground">{item.description}</p>
        </Card>
      </a>
    {/each}
  </div>
</section>

<!-- Getting started note -->
<Card class="mt-8 p-6">
  <h3 class="font-semibold text-foreground">New to Cubedrill?</h3>
  <p class="mt-1 max-w-2xl text-sm text-muted-foreground">
    Start by browsing the algorithm sets and adding the cases you want to learn to your personal
    set. From there you can drill them in the trainer, generate human-style solutions in the solver,
    and track your progress over time.
  </p>
  <div class="mt-4 flex flex-wrap gap-2">
    <Button href="/algorithms" variant="outline" size="sm">Browse algorithms</Button>
    <Button href="/progress" variant="ghost" size="sm">View progress</Button>
  </div>
</Card>

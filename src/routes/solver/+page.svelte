<script lang="ts">
  import { Wand2 } from 'lucide-svelte';
  import { PageHeader, PlaceholderView } from '$lib/components';
</script>

<svelte:head><title>Solver · Cubedrill</title></svelte:head>

<PageHeader title="Solver" description="Generate human-style solutions from your personal set." />
<PlaceholderView
  icon={Wand2}
  title="The solver is coming soon"
  description="Choose a scramble type and a solve target, then step through a solution built from the algorithms you're actually learning, with a per-phase breakdown."
/>

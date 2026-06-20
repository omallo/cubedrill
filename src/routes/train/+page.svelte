<script lang="ts">
  import { Dumbbell } from 'lucide-svelte';
  import { PageHeader, PlaceholderView } from '$lib/components';
</script>

<svelte:head><title>Train · Cubedrill</title></svelte:head>

<PageHeader title="Train" description="Drill algorithms with recognition and timing." />
<PlaceholderView
  icon={Dumbbell}
  title="The trainer is coming soon"
  description="A recognition-first drilling loop with a 3D cube, timing, randomization, and the same set/tag/status filters as the library."
/>

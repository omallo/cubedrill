<script lang="ts">
  import { Timer } from 'lucide-svelte';
  import { PageHeader, PlaceholderView } from '$lib/components';
</script>

<svelte:head><title>Solves · Cubedrill</title></svelte:head>

<PageHeader title="Solves" description="Practice full and partial solves with time tracking." />
<PlaceholderView
  icon={Timer}
  title="Solve practice is coming soon"
  description="Run full solves and targeted partial solves from specialized scrambles, capturing times and per-phase splits."
/>

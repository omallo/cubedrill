<script lang="ts">
  import { BarChart3 } from 'lucide-svelte';
  import { PageHeader, PlaceholderView } from '$lib/components';
</script>

<svelte:head><title>Progress · Cubedrill</title></svelte:head>

<PageHeader title="Progress" description="Goals, sessions, stats, and feedback over time." />
<PlaceholderView
  icon={BarChart3}
  title="Progress tracking is coming soon"
  description="Create and follow training goals, run sessions, and see dashboards for your learning progress, stats, and actionable feedback."
/>

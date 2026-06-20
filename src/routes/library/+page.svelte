<script lang="ts">
  import { Library } from 'lucide-svelte';
  import { PageHeader, PlaceholderView } from '$lib/components';
</script>

<svelte:head><title>Library · Cubedrill</title></svelte:head>

<PageHeader
  title="Library"
  description="Browse the built-in algorithm sets and curate your personal set."
/>
<PlaceholderView
  icon={Library}
  title="The algorithm library is coming soon"
  description="You'll browse cases with 2D recognition diagrams, filter by set, tag, status and slot, pick or author algorithms, and add them to your personal set."
/>

<script lang="ts">
  import { cn } from '$lib/utils/cn';

  type Props = {
    mastered: number;
    learning: number;
    total: number;
    class?: string;
  };

  let { mastered, learning, total, class: className = undefined }: Props = $props();

  const pct = (n: number) => (total > 0 ? (n / total) * 100 : 0);
</script>

<div
  class={cn('flex h-1.5 w-full overflow-hidden rounded-full bg-surface-muted', className)}
  title={`${mastered} mastered · ${learning} learning · ${total} total`}
>
  <div class="bg-emerald-500" style:width="{pct(mastered)}%"></div>
  <div class="bg-amber-500" style:width="{pct(learning)}%"></div>
</div>

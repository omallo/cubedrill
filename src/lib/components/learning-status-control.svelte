<script lang="ts" module>
  import type { LearningStatus } from '$lib/domain';

  type StatusMeta = { label: string; dot: string; chip: string };

  /** Presentation for each learning status — shared so summaries/filters can reuse it. */
  export const STATUS_META: Record<LearningStatus, StatusMeta> = {
    'not-learned': {
      label: 'Not learned',
      dot: 'bg-muted-foreground/40',
      chip: 'border-border text-muted-foreground hover:bg-surface-muted'
    },
    learning: {
      label: 'Learning',
      dot: 'bg-amber-500',
      chip: 'border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-400'
    },
    mastered: {
      label: 'Mastered',
      dot: 'bg-emerald-500',
      chip: 'border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-400'
    }
  };
</script>

<script lang="ts">
  import { cn } from '$lib/utils/cn';

  type Props = {
    status: LearningStatus;
    /** Called with the next status when the chip is clicked. */
    oncycle: () => void;
    class?: string;
  };

  let { status, oncycle, class: className = undefined }: Props = $props();

  const meta = $derived(STATUS_META[status]);
</script>

<button
  type="button"
  onclick={oncycle}
  title="Click to change learning status"
  class={cn(
    'inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors',
    meta.chip,
    className
  )}
>
  <span class={cn('h-2 w-2 rounded-full', meta.dot)}></span>
  {meta.label}
</button>

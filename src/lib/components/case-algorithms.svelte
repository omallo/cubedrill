<script lang="ts">
  import { Check, Plus, X, FlipHorizontal2, Star, Loader2 } from 'lucide-svelte';
  import { primaryAlgorithm, type Case, type F2LSlot } from '$lib/domain';
  import { personal } from '$lib/personal.svelte';
  import { validateAlgorithm } from '$lib/components/cube/validate';
  import { cn } from '$lib/utils/cn';

  type Props = {
    case: Case;
    /** F2L slot context, if any — authored algs are tagged with it. */
    slot?: F2LSlot;
  };

  let { case: c, slot }: Props = $props();

  // The reference algorithm defines the case; custom algorithms must solve it.
  const reference = $derived(primaryAlgorithm(c, slot)?.moves ?? '');
  const options = $derived(personal.algorithmsFor(c, slot));
  const primaryMoves = $derived(primaryAlgorithm(c, slot)?.moves);

  let adding = $state(false);
  let draft = $state('');
  let checking = $state(false);
  let error = $state<string | null>(null);

  function choose(moves: string) {
    personal.setChoice(c.id, slot, moves);
  }

  async function submit() {
    error = null;
    checking = true;
    try {
      const result = await validateAlgorithm(reference, draft);
      if (!result.valid) {
        error = result.error ?? 'Invalid algorithm.';
        return;
      }
      personal.addAuthored(c.id, { moves: draft.trim(), ...(slot ? { slot } : {}) });
      personal.setChoice(c.id, slot, draft.trim());
      draft = '';
      adding = false;
    } finally {
      checking = false;
    }
  }

  function cancel() {
    adding = false;
    draft = '';
    error = null;
  }
</script>

<div class="space-y-1.5">
  {#each options as opt (opt.alg.moves)}
    <div
      class={cn(
        'flex items-center gap-2 rounded-lg border px-3 py-1.5 transition-colors',
        opt.chosen
          ? 'border-brand-300 bg-brand-50 dark:border-brand-700 dark:bg-brand-500/10'
          : 'border-border'
      )}
    >
      <button
        type="button"
        onclick={() => choose(opt.alg.moves)}
        aria-pressed={opt.chosen}
        title={opt.chosen ? 'Selected' : 'Use this algorithm'}
        class={cn(
          'flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded-full border transition-colors',
          opt.chosen
            ? 'border-brand-500 bg-brand-500 text-white'
            : 'border-border hover:border-brand-400'
        )}
      >
        {#if opt.chosen}<Check size={12} />{/if}
      </button>
      <code class="min-w-0 flex-1 font-mono text-sm break-words text-foreground">
        {opt.alg.moves}
      </code>
      {#if opt.alg.moves === primaryMoves && !opt.authored}
        <span
          class="inline-flex shrink-0 items-center gap-0.5 text-[11px] font-medium text-muted-foreground"
          title="Recommended algorithm"
        >
          <Star size={11} /> primary
        </span>
      {/if}
      {#if opt.alg.derived}
        <span
          class="inline-flex shrink-0 items-center gap-0.5 rounded bg-brand-50 px-1.5 py-0.5 text-[11px] font-medium text-brand-700 dark:bg-brand-500/10 dark:text-brand-300"
          title="Mirror-derived algorithm"
        >
          <FlipHorizontal2 size={11} /> mirror
        </span>
      {/if}
      {#if opt.authored}
        <span class="shrink-0 text-[11px] font-medium text-muted-foreground">custom</span>
        <button
          type="button"
          aria-label="Delete custom algorithm"
          onclick={() => personal.removeAuthored(c.id, opt.alg.moves)}
          class="flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded text-muted-foreground transition-colors hover:bg-accent hover:text-rose-500"
        >
          <X size={13} />
        </button>
      {/if}
    </div>
  {/each}

  {#if adding}
    <form
      onsubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      class="flex flex-col gap-2 rounded-lg border border-border p-2"
    >
      <div class="flex items-center gap-2">
        <input
          bind:value={draft}
          oninput={() => (error = null)}
          placeholder="e.g. R U R' U'"
          spellcheck="false"
          autocomplete="off"
          class="h-8 flex-1 rounded-md border border-border bg-surface px-2 font-mono text-sm text-foreground placeholder:text-muted-foreground"
        />
        <button
          type="submit"
          disabled={checking || !draft.trim()}
          class="inline-flex h-8 cursor-pointer items-center gap-1 rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          {#if checking}<Loader2 size={14} class="animate-spin" />{:else}<Check size={14} />{/if}
          Validate & add
        </button>
        <button
          type="button"
          onclick={cancel}
          class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent"
        >
          <X size={15} />
        </button>
      </div>
      {#if error}
        <p class="text-xs text-rose-600 dark:text-rose-400">{error}</p>
      {:else}
        <p class="text-xs text-muted-foreground">
          Your algorithm is checked against the cube engine — it must actually solve the case.
        </p>
      {/if}
    </form>
  {:else}
    <button
      type="button"
      onclick={() => (adding = true)}
      class="inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-500/10"
    >
      <Plus size={15} /> Add custom algorithm
    </button>
  {/if}
</div>

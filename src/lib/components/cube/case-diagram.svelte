<script lang="ts">
  import { onMount } from 'svelte';
  import { Play } from 'lucide-svelte';
  import { getPhase, type StickeringMask } from '$lib/domain';
  import { cn } from '$lib/utils/cn';
  import CubePlayer from './cube-player.svelte';

  type Props = {
    /** Solution moves for the case (setup is derived by inverting). */
    moves: string;
    /** Phase id — drives the stickering mask and default visualization. */
    phaseId: string;
    /** Override the phase's default visualization. */
    visualization?: '2D' | '3D';
    hintFacelets?: boolean;
    class?: string;
  };

  let {
    moves,
    phaseId,
    visualization = undefined,
    hintFacelets = false,
    class: className = undefined
  }: Props = $props();

  const maskToStickering: Record<StickeringMask, string> = {
    full: 'full',
    cross: 'Cross',
    f2l: 'F2L',
    'f2l-slot': 'F2L',
    oll: 'OLL',
    pll: 'full'
  };

  const phase = $derived(getPhase(phaseId));
  const viz = $derived(visualization ?? phase?.defaultVisualization ?? '3D');
  const stickering = $derived(phase ? maskToStickering[phase.mask] : 'full');

  let host: HTMLDivElement;
  let visible = $state(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cube = $state<any>(null);

  // Only mount the (heavy, WebGL-for-3D) player once it scrolls near the viewport.
  onMount(() => {
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          visible = true;
          io.disconnect();
        }
      },
      { rootMargin: '300px' }
    );
    io.observe(host);
    return () => io.disconnect();
  });
</script>

<div bind:this={host} class={cn('group relative aspect-square', className)}>
  {#if visible}
    <CubePlayer {moves} {stickering} visualization={viz} {hintFacelets} bind:this={cube} />
    <button
      type="button"
      onclick={() => cube?.play()}
      aria-label="Play algorithm"
      class="absolute right-1 bottom-1 flex h-7 w-7 items-center justify-center rounded-full bg-surface/80 text-foreground opacity-0 shadow-sm ring-1 ring-border backdrop-blur transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
    >
      <Play size={14} class="translate-x-px" />
    </button>
  {/if}
</div>

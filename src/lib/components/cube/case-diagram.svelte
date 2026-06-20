<script lang="ts">
  import { onMount } from 'svelte';
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

  /** Solve the case (no-op until the player has mounted). */
  export function play() {
    cube?.play();
  }

  /** Reset the cube back to the case start. */
  export function reset() {
    cube?.reset();
  }

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

<div bind:this={host} class={cn('relative aspect-square', className)}>
  {#if visible}
    <CubePlayer {moves} {stickering} visualization={viz} {hintFacelets} bind:this={cube} />
  {/if}
</div>

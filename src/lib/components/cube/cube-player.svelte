<script lang="ts">
  // Static import registers the <twisty-player> custom element and lets Svelte set
  // its properties at upgrade time (the POC's proven pattern). cubing.js is heavy,
  // so cube components are imported directly by the algorithms/solver routes —
  // never via the shared component barrel — keeping cubing out of the main bundle.
  import 'cubing/twisty';
  import { Alg } from 'cubing/alg';
  import { cn } from '$lib/utils/cn';

  type Props = {
    /** The solution move sequence. The setup (scramble) is derived by inverting it. */
    moves: string;
    /** Rotation applied before the derived setup, to orient the cube (e.g. 'z2'). */
    orientation?: string;
    /** cubing.js stickering preset: 'full' | 'OLL' | 'PLL' | 'F2L' | 'Cross' | 'none'. */
    stickering?: string;
    visualization?: '2D' | '3D';
    hintFacelets?: boolean;
    tempoScale?: number;
    class?: string;
  };

  let {
    moves,
    orientation = undefined,
    stickering = 'full',
    visualization = '3D',
    hintFacelets = false,
    tempoScale = 2,
    class: className = undefined
  }: Props = $props();

  const vizFormat = { '2D': 'experimental-2D-LL', '3D': 'PG3D' } as const;

  // Loosely typed: bind:this on the custom element doesn't match the TwistyPlayer
  // class type (private fields), and cubing is registered via side-effect import.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let player = $state<any>();

  const setup = $derived(new Alg(moves).invert().toString());
  const setupAlg = $derived(orientation ? `${orientation} ${setup}` : setup);

  /** Play the algorithm from the start. */
  export function play() {
    if (!player) return;
    player.jumpToStart();
    player.play();
  }

  /** Reset to the case (start) position. */
  export function reset() {
    player?.jumpToStart();
  }
</script>

<twisty-player
  bind:this={player}
  class={cn('h-full w-full', className)}
  puzzle="3x3x3"
  visualization={vizFormat[visualization]}
  background="none"
  controlPanel="none"
  hintFacelets={hintFacelets ? 'auto' : 'none'}
  experimentalStickering={stickering}
  experimentalSetupAlg={setupAlg}
  alg={moves}
  {tempoScale}
></twisty-player>

<script lang="ts">
  // A 3D player for a full solution: the cube starts at the scrambled state
  // (experimentalSetupAlg = scramble + the moves already executed) and animates
  // the active phase (alg = that phase's moves). Unlike CubePlayer this does NOT
  // invert the moves — the cube genuinely starts scrambled and is solved forward.
  import 'cubing/twisty';
  import { cn } from '$lib/utils/cn';

  type Props = {
    /** The scramble applied to a solved cube. */
    scramble: string;
    /** Moves already executed before the active phase (shown as the start state). */
    preMoves?: string;
    /** The active phase's moves, animated by play(). */
    activeMoves?: string;
    visualization?: '2D' | '3D';
    hintFacelets?: boolean;
    class?: string;
  };

  let {
    scramble,
    preMoves = '',
    activeMoves = '',
    visualization = '3D',
    hintFacelets = false,
    class: className = undefined
  }: Props = $props();

  const vizFormat = { '2D': 'experimental-2D-LL', '3D': 'PG3D' } as const;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let player = $state<any>();

  const setupAlg = $derived(`${scramble} ${preMoves}`.trim());

  /** Animate the active phase from its start. */
  export function play() {
    if (!player) return;
    player.jumpToStart();
    player.play();
  }

  /** Jump to the start of the active phase (before its moves). */
  export function reset() {
    player?.jumpToStart();
  }

  /** Jump to the end of the active phase (after its moves). */
  export function jumpToEnd() {
    player?.jumpToEnd();
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
  experimentalDragInput="none"
  experimentalStickering="full"
  experimentalSetupAlg={setupAlg}
  alg={activeMoves}
  tempoScale={2}
></twisty-player>

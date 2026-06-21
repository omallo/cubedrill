/**
 * F2L slot derivation by mirroring.
 *
 * F2L cases are authored for the FR slot (plus BR where a good alg exists). The
 * other slots are the reflections of an authored one and are filled in here:
 *
 *   FR → FL : mirror across the M plane (left-right, swaps R/L)
 *   FR → BR : mirror across the S plane (front-back, swaps F/B)
 *   BR → BL : mirror across the M plane (left-right)  [BR authored or derived]
 *
 * A reflection is an isometry, so the mirrored alg solves the mirrored case in
 * the mirrored slot. Derivation is per case and only fills slots without an
 * authored alg — authored algs always win. This is a pure string transform (no
 * cubing.js) so it stays out of the main bundle; the transforms were verified
 * against the cubing.js kpuzzle offline (all 41 cases: every slot alg solves,
 * and the four slots are distinct).
 */
import type { Algorithm, Case, F2LSlot } from './types';

type Plane = 'M' | 'S';

const SWAP: Record<Plane, Record<string, string>> = {
  M: { R: 'L', L: 'R', r: 'l', l: 'r' },
  S: { F: 'B', B: 'F', f: 'b', b: 'f' }
};

/** Invert a move's amount: CW ↔ CCW, doubles stay double. */
function invertAmount(suffix: string): string {
  if (suffix === '2' || suffix === "2'") return '2';
  return suffix === "'" ? '' : "'";
}

/** Reflect a move sequence across the M (left-right) or S (front-back) plane.
 *  Only move tokens are rewritten, so parentheses and spacing are preserved. */
export function mirrorMoves(moves: string, plane: Plane): string {
  const swap = SWAP[plane];
  return moves.replace(
    /([A-Za-z])([2']*)/g,
    (_, base, suffix) => (swap[base] ?? base) + invertAmount(suffix)
  );
}

function moveOf(c: Case, slot: F2LSlot): string | undefined {
  const inSlot = c.algorithms.filter((a) => a.slot === slot);
  return (inSlot.find((a) => a.primary) ?? inSlot[0])?.moves;
}

/**
 * A case with its missing F2L slots filled by mirroring. No-op for unsliced
 * cases (OLL/PLL) and for cases without an FR base alg. Authored algorithms are
 * preserved; derived ones are appended with `derived: true`.
 */
export function withDerivedSlots(c: Case): Case {
  const present = new Set(c.algorithms.map((a) => a.slot).filter(Boolean) as F2LSlot[]);
  if (present.size === 0) return c;
  const fr = moveOf(c, 'FR');
  if (!fr) return c;

  const derive = (slot: F2LSlot, moves: string, plane: Plane): Algorithm => ({
    id: `${c.id}/${slot.toLowerCase()}`,
    moves: mirrorMoves(moves, plane),
    slot,
    derived: true,
    primary: true
  });

  const derived: Algorithm[] = [];
  if (!present.has('FL')) derived.push(derive('FL', fr, 'M'));
  if (!present.has('BR')) derived.push(derive('BR', fr, 'S'));
  // BL mirrors BR — whichever BR we end up with (authored, or the one just derived).
  const br = moveOf(c, 'BR') ?? derived.find((a) => a.slot === 'BR')?.moves;
  if (!present.has('BL') && br) derived.push(derive('BL', br, 'M'));

  return derived.length ? { ...c, algorithms: [...c.algorithms, ...derived] } : c;
}

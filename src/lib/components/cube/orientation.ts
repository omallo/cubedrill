/**
 * Orientation handling for derived case setups.
 *
 * A case is shown by applying a *setup* (the inverse of the solution) to a solved
 * cube, so the cube starts at the case and the algorithm solves it. The naive
 * `invert(moves)` leaks any **net whole-cube rotation** the algorithm carries
 * (e.g. an F2L alg's leading `y` slot-selector, or PLL V-perm's mid-alg `y`): the
 * displayed case ends up in the algorithm's ending orientation instead of the
 * canonical one. We fix this centrally — the algorithm data stays the real,
 * executable alg — by prepending the alg's net rotation to the setup, which puts
 * the case back in canonical orientation (centers solved).
 *
 * For normal-cube training we also expose a clean, rotation-free **setup scramble**
 * (the moves to apply to a solved cube to reach the case): the net rotation is
 * conjugated through the sequence so it cancels, leaving pure face/slice turns.
 *
 * Everything needs the cubing.js kpuzzle (async), so this module lives next to the
 * other cube components and is imported only by them — keeping cubing.js out of the
 * main bundle. The lookup tables are built once and cached.
 */
import { Alg } from 'cubing/alg';
import { cube3x3x3 } from 'cubing/puzzles';

interface Lookup {
  /** Net whole-cube rotation of an alg, as a rotation alg ('' when none). */
  netRotation: (moves: string) => string;
  /** Push rotations rightward so a net-rotation-free alg becomes pure turns. */
  eliminate: (alg: string) => string;
  /** cubing.js cancellation pass (combines adjacent moves, drops no-ops). */
  simplify: (alg: string) => string;
  /** Stable key of the full resulting pattern (for equivalence checks). */
  patternKey: (alg: string) => string;
}

let lookupPromise: Promise<Lookup> | null = null;

async function buildLookup(): Promise<Lookup> {
  const kpuzzle = await cube3x3x3.kpuzzle();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const patternData = (alg: string): any =>
    kpuzzle.defaultPattern().applyAlg(new Alg(alg)).patternData;
  const patternKey = (alg: string) => JSON.stringify(patternData(alg));
  const centersKey = (alg: string) => patternData(alg).CENTERS.pieces.join(',');
  const ID = centersKey('');

  // Move vocabulary for rotation elimination: faces, wide moves, slices.
  const bases = ['U', 'D', 'L', 'R', 'F', 'B', 'u', 'd', 'l', 'r', 'f', 'b', 'M', 'E', 'S'];
  const vocab = bases.flatMap((b) => [b, `${b}'`, `${b}2`]);
  const rots = ['x', "x'", 'x2', 'y', "y'", 'y2', 'z', "z'", 'z2'];
  const invRot = (r: string) => (r.endsWith("'") ? r.slice(0, -1) : r.endsWith('2') ? r : `${r}'`);

  // Canonical move name keyed by its pattern, so any notation (e.g. `U2'`) normalizes.
  const byPattern: Record<string, string> = {};
  for (const m of vocab) byPattern[patternKey(m)] = m;
  const norm = (mv: string) => byPattern[patternKey(mv)] ?? mv;

  // table[rot][move] = the move re-expressed after `rot` (i.e. rot·move·rot').
  const table: Record<string, Record<string, string>> = {};
  for (const r of rots) {
    table[r] = {};
    for (const m of vocab) table[r][m] = norm(`${r} ${m} ${invRot(r)}`);
  }

  // Each of the 24 orientations → its shortest rotation alg.
  const rotFor = new Map<string, string>([[ID, '']]);
  let frontier = [''];
  for (let depth = 0; depth < 3 && rotFor.size < 24; depth++) {
    const next: string[] = [];
    for (const seq of frontier) {
      for (const g of rots) {
        const alg = seq ? `${seq} ${g}` : g;
        const k = centersKey(alg);
        if (!rotFor.has(k)) {
          rotFor.set(k, alg);
          next.push(alg);
        }
      }
    }
    frontier = next;
  }

  const netRotation = (moves: string) => rotFor.get(centersKey(moves)) ?? '';

  const eliminate = (alg: string) => {
    const moves = new Alg(alg).expand().toString().split(/\s+/).filter(Boolean);
    const pending: string[] = [];
    const out: string[] = [];
    for (const mv of moves) {
      if (/^[xyz]/.test(mv)) {
        pending.push(mv);
      } else {
        let cur = norm(mv);
        for (let i = pending.length - 1; i >= 0; i--) cur = table[pending[i]][cur] ?? cur;
        out.push(cur);
      }
    }
    return out.join(' ');
  };

  const simplify = (alg: string) =>
    new Alg(alg).experimentalSimplify({ cancel: true, puzzleLoader: cube3x3x3 }).toString();

  return { netRotation, eliminate, simplify, patternKey };
}

function lookup(): Promise<Lookup> {
  if (!lookupPromise) lookupPromise = buildLookup();
  return lookupPromise;
}

/**
 * The setup alg that places the case in canonical orientation. `orientation` is an
 * optional cosmetic reorientation applied outermost (e.g. `z2` for a white cross on
 * the bottom). The cube then solves the case by playing `moves`.
 */
export async function deriveSetup(moves: string, orientation?: string): Promise<string> {
  const m = moves?.trim();
  if (!m) return orientation ?? '';
  const { netRotation } = await lookup();
  const rot = netRotation(m);
  const inv = new Alg(m).invert().toString();
  const core = rot ? `${rot} ${inv}` : inv;
  return orientation ? `${orientation} ${core}` : core;
}

/**
 * A clean, rotation-free scramble to apply to a *solved* cube to reach the case
 * (for practising on a normal cube). Falls back to a correct rotation-bearing form
 * in the rare case elimination can't fully cancel (verified before returning).
 */
export async function setupScramble(moves: string): Promise<string> {
  const m = moves?.trim();
  if (!m) return '';
  const { netRotation, eliminate, simplify, patternKey } = await lookup();
  const rot = netRotation(m);
  const core = (rot ? `${rot} ` : '') + new Alg(m).invert().expand().toString();
  const candidate = simplify(eliminate(core));
  if (!/[xyz]/.test(candidate) && patternKey(candidate) === patternKey(core)) return candidate;
  return simplify(core);
}

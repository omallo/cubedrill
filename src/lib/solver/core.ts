/**
 * CFOP solver core — cube state, move tables, and the search that solves the
 * Cross and F2L phases of a 3×3×3.
 *
 * This module is deliberately framework-free (it imports only cubing.js and
 * type-only domain types) so it can be unit-tested directly under node. The
 * recognition phases (OLL/PLL) live in `recognize.ts`; the orchestration that
 * turns these into a labelled, human-style solution lives in `solve.ts`.
 *
 * Conventions (verified empirically against cubing.js' 3×3×3 kpuzzle):
 *   - cubing.js default orientation is white-U / green-F. We solve geometrically:
 *     the Cross on the D layer, F2L into the four D-layer slots, the last layer
 *     on U. Cross *colour* is cosmetic for a solver.
 *   - Orbit indices (cubie ids = solved locations):
 *       EDGES   UF0 UR1 UB2 UL3  DF4 DR5 DB6 DL7  FR8 FL9 BR10 BL11
 *       CORNERS UFR0 URB1 UBL2 ULF3  DFR4 DLF5 DBL6 DRB7
 *   - A kpuzzle pattern stores, per location i, `pieces[i]` = the cubie now at i
 *     and `orientation[i]` = its orientation. Applying move M composes as
 *       new.pieces[i] = cur.pieces[M.pieces[i]]
 *       new.ori[i]    = (cur.ori[M.pieces[i]] + M.ori[i]) mod modulus
 */
import { Alg } from 'cubing/alg';
import { cube3x3x3 } from 'cubing/puzzles';

export type Slot = 'FR' | 'FL' | 'BR' | 'BL';

/** Cross edge locations (D layer): DF DR DB DL. */
const CROSS_EDGES = [4, 5, 6, 7];

/** The corner + middle edge that make up each F2L slot. */
const SLOT_PIECES: Record<Slot, { corner: number; edge: number }> = {
  FR: { corner: 4, edge: 8 }, // DFR + FR
  FL: { corner: 5, edge: 9 }, // DLF + FL
  BR: { corner: 7, edge: 10 }, // DRB + BR
  BL: { corner: 6, edge: 11 } // DBL + BL
};

export const SLOTS: Slot[] = ['FR', 'FL', 'BR', 'BL'];

const FACES = ['U', 'D', 'L', 'R', 'F', 'B'];
const SUFFIX = ['', '2', "'"];
/** The 18 face moves, indexed 0..17. faceOf(m) = (m / 3 | 0). */
export const MOVES: string[] = FACES.flatMap((f) => SUFFIX.map((s) => f + s));
const faceOf = (m: number) => (m / 3) | 0;
/** Opposite-face index pairs, for axis-aware move pruning. */
const OPPOSITE = [1, 0, 3, 2, 5, 4]; // U-D, L-R, F-B (in FACES order)

/** Flat cube state: corner/edge permutation + orientation arrays. */
export interface CubeState {
  cp: number[];
  co: number[];
  ep: number[];
  eo: number[];
}

interface MoveTable {
  cp: number[];
  co: number[];
  ep: number[];
  eo: number[];
}

export interface SolverCore {
  /** Parse a move string into a flat cube state (applied to a solved cube). */
  fromAlg(alg: string): CubeState;
  /** True once the four cross edges are home and oriented. */
  crossSolved(s: CubeState): boolean;
  /** True once a given slot's corner + edge are home and oriented. */
  slotSolved(s: CubeState, slot: Slot): boolean;
  /** Solve the cross; returns the move string (face turns only). */
  solveCross(s: CubeState): string;
  /** Solve one F2L slot while preserving the cross and the kept slots. */
  solveSlot(s: CubeState, slot: Slot, keep: Slot[]): string;
  /** Apply a face-move string to a flat state (rotations not supported here). */
  apply(s: CubeState, alg: string): CubeState;

  // -- kpuzzle-backed helpers, used by the OLL/PLL recognition phases. These
  //    accept full notation (slices, rotations) since recognition applies the
  //    catalog algorithms verbatim. Patterns are opaque cubing.js objects.
  /** The pattern reached by applying `alg` to a solved cube. */
  pattern(alg: string): CubePattern;
  /** The pattern reached by applying `alg` to an existing pattern. */
  applyToPattern(p: CubePattern, alg: string): CubePattern;
  /** True once the last layer (U) is fully oriented and F2L is intact. */
  llOriented(p: CubePattern): boolean;
  /** True once the whole cube is solved (tolerating a net cube rotation). */
  isSolved(p: CubePattern): boolean;
  /**
   * Re-express an algorithm so it carries no net whole-cube rotation (by
   * appending the inverse of its net rotation). Equivalent solving effect; lets
   * recognition apply AUFs in the canonical frame. Used on candidate LL algs.
   */
  normalize(alg: string): string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type CubePattern = any;

let corePromise: Promise<SolverCore> | null = null;

/** The shared solver core (move tables + pruning DBs built once, then cached). */
export function getCore(): Promise<SolverCore> {
  return (corePromise ??= build());
}

async function build(): Promise<SolverCore> {
  const kpuzzle = await cube3x3x3.kpuzzle();
  const solved = kpuzzle.defaultPattern();

  // Build the 18 move tables by reading each move applied to a solved cube.
  const tables: MoveTable[] = MOVES.map((m) => {
    const d = solved.applyAlg(new Alg(m)).patternData;
    return {
      cp: [...d.CORNERS.pieces],
      co: [...d.CORNERS.orientation],
      ep: [...d.EDGES.pieces],
      eo: [...d.EDGES.orientation]
    };
  });

  function applyMove(s: CubeState, m: number): CubeState {
    const t = tables[m];
    const cp = new Array(8);
    const co = new Array(8);
    for (let i = 0; i < 8; i++) {
      cp[i] = s.cp[t.cp[i]];
      co[i] = (s.co[t.cp[i]] + t.co[i]) % 3;
    }
    const ep = new Array(12);
    const eo = new Array(12);
    for (let i = 0; i < 12; i++) {
      ep[i] = s.ep[t.ep[i]];
      eo[i] = (s.eo[t.ep[i]] + t.eo[i]) % 2;
    }
    return { cp, co, ep, eo };
  }

  function fromAlg(alg: string): CubeState {
    const d = solved.applyAlg(new Alg(alg)).patternData;
    return {
      cp: [...d.CORNERS.pieces],
      co: [...d.CORNERS.orientation],
      ep: [...d.EDGES.pieces],
      eo: [...d.EDGES.orientation]
    };
  }

  function apply(s: CubeState, alg: string): CubeState {
    let cur = s;
    for (const mv of alg.split(/\s+/).filter(Boolean)) {
      const idx = MOVES.indexOf(normalizeMove(mv));
      if (idx < 0) throw new Error(`unsupported move in core.apply: ${mv}`);
      cur = applyMove(cur, idx);
    }
    return cur;
  }

  // ---- Pruning databases (projected pattern DBs) --------------------------
  //
  // Each DB records, per projected sub-state, the minimum number of moves to
  // restore that subset — an admissible heuristic. They are filled by BFS in
  // the *projected* space using per-move inverse-permutation tables.

  // Inverse permutations + orientation-at-destination, per move.
  const invE: number[][] = tables.map((t) => {
    const inv = new Array(12);
    for (let i = 0; i < 12; i++) inv[t.ep[i]] = i;
    return inv;
  });
  const invC: number[][] = tables.map((t) => {
    const inv = new Array(8);
    for (let i = 0; i < 8; i++) inv[t.cp[i]] = i;
    return inv;
  });
  const edgeState = (loc: number, ori: number) => loc * 2 + ori;
  const cornerState = (loc: number, ori: number) => loc * 3 + ori;

  /** Move an edge cubie's (loc, ori) projected state under move m. */
  function moveEdge(st: number, m: number): number {
    const loc = (st / 2) | 0;
    const ori = st % 2;
    const nloc = invE[m][loc];
    return edgeState(nloc, (ori + tables[m].eo[nloc]) % 2);
  }
  function moveCorner(st: number, m: number): number {
    const loc = (st / 3) | 0;
    const ori = st % 3;
    const nloc = invC[m][loc];
    return cornerState(nloc, (ori + tables[m].co[nloc]) % 3);
  }

  /** PDB over a set of edge cubies (their joint placement). */
  function buildEdgeDB(cubies: number[]): { table: Uint8Array; index: (s: CubeState) => number } {
    const n = cubies.length;
    const size = 24 ** n;
    const table = new Uint8Array(size).fill(255);
    const start = encodeEdges(cubies.map((c) => edgeState(c, 0)));
    table[start] = 0;
    let frontier = [cubies.map((c) => edgeState(c, 0))];
    for (let depth = 0; frontier.length; depth++) {
      const next: number[][] = [];
      for (const states of frontier) {
        for (let m = 0; m < 18; m++) {
          const ns = states.map((st) => moveEdge(st, m));
          const idx = encodeEdges(ns);
          if (table[idx] === 255) {
            table[idx] = depth + 1;
            next.push(ns);
          }
        }
      }
      frontier = next;
    }
    function encodeEdges(states: number[]): number {
      let idx = 0;
      for (let i = states.length - 1; i >= 0; i--) idx = idx * 24 + states[i];
      return idx;
    }
    const index = (s: CubeState) => {
      const loc = new Array(12);
      for (let i = 0; i < 12; i++) loc[s.ep[i]] = i;
      return encodeEdges(cubies.map((c) => edgeState(loc[c], s.eo[loc[c]])));
    };
    return { table, index };
  }

  /** PDB over one corner + one edge (an F2L pair). */
  function buildPairDB(
    corner: number,
    edge: number
  ): {
    table: Uint8Array;
    index: (s: CubeState) => number;
  } {
    const size = 24 * 24;
    const table = new Uint8Array(size).fill(255);
    const enc = (cs: number, es: number) => cs * 24 + es;
    const start = enc(cornerState(corner, 0), edgeState(edge, 0));
    table[start] = 0;
    let frontier = [[cornerState(corner, 0), edgeState(edge, 0)] as [number, number]];
    for (let depth = 0; frontier.length; depth++) {
      const next: [number, number][] = [];
      for (const [cs, es] of frontier) {
        for (let m = 0; m < 18; m++) {
          const ncs = moveCorner(cs, m);
          const nes = moveEdge(es, m);
          const idx = enc(ncs, nes);
          if (table[idx] === 255) {
            table[idx] = depth + 1;
            next.push([ncs, nes]);
          }
        }
      }
      frontier = next;
    }
    const index = (s: CubeState) => {
      const cloc = s.cp.indexOf(corner);
      const eloc = s.ep.indexOf(edge);
      return enc(cornerState(cloc, s.co[cloc]), edgeState(eloc, s.eo[eloc]));
    };
    return { table, index };
  }

  const crossDB = buildEdgeDB(CROSS_EDGES);
  const pairDB: Record<Slot, ReturnType<typeof buildPairDB>> = {
    FR: buildPairDB(SLOT_PIECES.FR.corner, SLOT_PIECES.FR.edge),
    FL: buildPairDB(SLOT_PIECES.FL.corner, SLOT_PIECES.FL.edge),
    BR: buildPairDB(SLOT_PIECES.BR.corner, SLOT_PIECES.BR.edge),
    BL: buildPairDB(SLOT_PIECES.BL.corner, SLOT_PIECES.BL.edge)
  };

  // ---- Goal tests ---------------------------------------------------------

  function crossSolved(s: CubeState): boolean {
    return CROSS_EDGES.every((e) => s.ep[e] === e && s.eo[e] === 0);
  }
  function slotSolved(s: CubeState, slot: Slot): boolean {
    const { corner, edge } = SLOT_PIECES[slot];
    return s.cp[corner] === corner && s.co[corner] === 0 && s.ep[edge] === edge && s.eo[edge] === 0;
  }

  // ---- IDA* search --------------------------------------------------------

  function ida(
    start: CubeState,
    heuristic: (s: CubeState) => number,
    goal: (s: CubeState) => boolean,
    maxDepth: number
  ): number[] | null {
    if (goal(start)) return [];
    for (let bound = heuristic(start); bound <= maxDepth; bound++) {
      const path: number[] = [];
      if (dfs(start, 0, bound, -1, path, heuristic, goal)) return path;
    }
    return null;
  }

  function dfs(
    s: CubeState,
    g: number,
    bound: number,
    prevFace: number,
    path: number[],
    heuristic: (s: CubeState) => number,
    goal: (s: CubeState) => boolean
  ): boolean {
    const h = heuristic(s);
    if (g + h > bound) return false;
    if (goal(s)) return true;
    for (let m = 0; m < 18; m++) {
      const f = faceOf(m);
      if (f === prevFace) continue; // never twist the same face twice
      if (OPPOSITE[f] === prevFace && f < prevFace) continue; // canonical order on an axis
      const ns = applyMove(s, m);
      path.push(m);
      if (dfs(ns, g + 1, bound, f, path, heuristic, goal)) return true;
      path.pop();
    }
    return false;
  }

  const toAlg = (path: number[]) => path.map((m) => MOVES[m]).join(' ');

  function solveCross(s: CubeState): string {
    const path = ida(s, (st) => crossDB.table[crossDB.index(st)], crossSolved, 10);
    return path ? toAlg(path) : '';
  }

  function solveSlot(s: CubeState, slot: Slot, keep: Slot[]): string {
    const target = pairDB[slot];
    const kept = keep.map((k) => pairDB[k]);
    const heuristic = (st: CubeState) => {
      let h = Math.max(crossDB.table[crossDB.index(st)], target.table[target.index(st)]);
      for (const db of kept) h = Math.max(h, db.table[db.index(st)]);
      return h;
    };
    const goal = (st: CubeState) =>
      crossSolved(st) && slotSolved(st, slot) && keep.every((k) => slotSolved(st, k));
    const path = ida(s, heuristic, goal, 16);
    return path ? toAlg(path) : '';
  }

  // ---- kpuzzle-backed LL recognition helpers ------------------------------

  const pattern = (alg: string): CubePattern => solved.applyAlg(new Alg(alg));
  const applyToPattern = (p: CubePattern, alg: string): CubePattern => p.applyAlg(new Alg(alg));

  // Keys of the 24 whole-cube rotations of a solved cube, to test "solved up to
  // a net rotation" (some PLL algorithms end in a rotated-but-solved state).
  const rotAlgs = (() => {
    const out = new Set<string>(['']);
    let frontier = [''];
    for (let d = 0; d < 3; d++) {
      const next: string[] = [];
      for (const seq of frontier)
        for (const g of ['x', "x'", 'y', "y'", 'z', "z'"]) {
          const alg = seq ? `${seq} ${g}` : g;
          next.push(alg);
        }
      frontier = next;
      for (const a of next) out.add(a);
    }
    return [...out];
  })();
  const solvedKeys = new Set(
    rotAlgs.map((r) => JSON.stringify(solved.applyAlg(new Alg(r)).patternData))
  );

  const isSolved = (p: CubePattern): boolean => solvedKeys.has(JSON.stringify(p.patternData));

  // Map a cube's centre arrangement to the rotation that produces it, so we can
  // detect (and cancel) an algorithm's net whole-cube rotation.
  const centersKey = (p: CubePattern) => p.patternData.CENTERS.pieces.join(',');
  const rotByCenters = new Map<string, string>();
  for (const r of rotAlgs) {
    const k = centersKey(solved.applyAlg(new Alg(r)));
    if (!rotByCenters.has(k)) rotByCenters.set(k, r);
  }
  const normalize = (alg: string): string => {
    const rot = rotByCenters.get(centersKey(solved.applyAlg(new Alg(alg)))) ?? '';
    return rot ? `${alg} ${new Alg(rot).invert().toString()}` : alg;
  };

  const llOriented = (p: CubePattern): boolean => {
    const d = p.patternData;
    // Last layer (U) fully oriented...
    for (let i = 0; i < 4; i++) {
      if (d.CORNERS.orientation[i] !== 0 || d.EDGES.orientation[i] !== 0) return false;
    }
    // ...and F2L (everything below U) still intact.
    for (let i = 4; i < 8; i++)
      if (d.CORNERS.pieces[i] !== i || d.CORNERS.orientation[i] !== 0) return false;
    for (let i = 4; i < 12; i++)
      if (d.EDGES.pieces[i] !== i || d.EDGES.orientation[i] !== 0) return false;
    return true;
  };

  return {
    fromAlg,
    crossSolved,
    slotSolved,
    solveCross,
    solveSlot,
    apply,
    pattern,
    applyToPattern,
    llOriented,
    isSolved,
    normalize
  };
}

/** Normalize cubing notation variants (e.g. `U2'`) to a canonical MOVES entry. */
function normalizeMove(mv: string): string {
  if (mv.endsWith("2'") || mv.endsWith("'2")) return mv[0] + '2';
  return mv;
}

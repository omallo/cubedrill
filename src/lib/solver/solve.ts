/**
 * Human-style CFOP solve orchestration. Solves the Cross and F2L by search
 * (`core`), then recognizes OLL and PLL from a supplied candidate set
 * (`recognize`). Produces a phase-by-phase breakdown the UI can step through.
 */
import { getCore, SLOTS, type Slot } from './core';
import { recognizeOLL, recognizePLL, type LLCandidate } from './recognize';

export type SolvePhase = 'cross' | 'f2l' | 'oll' | 'pll';

/** How far to take the solve — the rest of the phases are omitted. */
export type SolveTarget = 'cross' | 'f2l' | 'oll' | 'full';

export interface SolveStep {
  phase: SolvePhase;
  /** Display label, e.g. 'Cross', '1st Pair', 'OLL'. */
  label: string;
  /** F2L only: the slot this step fills. */
  slot?: Slot;
  /** The recognized case name (e.g. 'Sune', 'T'), when known. */
  caseName?: string;
  caseId?: string;
  /** Move sequence for the step (empty when skipped). */
  moves: string;
  moveCount: number;
  /** True when the phase needed no moves (e.g. an OLL skip). */
  skip: boolean;
  /** True when a phase could not be recognized from the candidate set. */
  unresolved?: boolean;
}

export interface Solution {
  scramble: string;
  steps: SolveStep[];
  /** The full solution as a single move string. */
  moves: string;
  moveCount: number;
  /** True when every targeted phase was resolved into moves. */
  complete: boolean;
}

export interface SolveOptions {
  target?: SolveTarget;
  ollCandidates: LLCandidate[];
  pllCandidates: LLCandidate[];
}

const PAIR_LABELS = ['1st Pair', '2nd Pair', '3rd Pair', '4th Pair'];
const countMoves = (alg: string) => alg.split(/\s+/).filter(Boolean).length;
const PHASE_RANK: Record<SolveTarget, number> = { cross: 0, f2l: 1, oll: 2, full: 3 };

export async function solve(scramble: string, opts: SolveOptions): Promise<Solution> {
  const target = opts.target ?? 'full';
  const core = await getCore();
  const steps: SolveStep[] = [];

  // Cancel any net rotation a candidate alg carries (e.g. the A-perms' leading
  // `x`), so AUFs apply in the canonical frame and recognition is exact.
  const clean = (c: LLCandidate): LLCandidate => ({ ...c, moves: core.normalize(c.moves) });
  const ollCandidates = opts.ollCandidates.map(clean);
  const pllCandidates = opts.pllCandidates.map(clean);

  let state = core.fromAlg(scramble);

  // -- Cross --------------------------------------------------------------
  const cross = core.solveCross(state);
  state = core.apply(state, cross);
  steps.push({
    phase: 'cross',
    label: 'Cross',
    moves: cross,
    moveCount: countMoves(cross),
    skip: cross === ''
  });

  if (PHASE_RANK[target] >= PHASE_RANK.f2l) {
    // -- F2L --------------------------------------------------------------
    const done: Slot[] = [];
    SLOTS.forEach((slot, i) => {
      const sol = core.solveSlot(state, slot, done);
      state = core.apply(state, sol);
      done.push(slot);
      steps.push({
        phase: 'f2l',
        label: PAIR_LABELS[i],
        slot,
        moves: sol,
        moveCount: countMoves(sol),
        skip: sol === ''
      });
    });
  }

  let complete = true;

  if (PHASE_RANK[target] >= PHASE_RANK.oll) {
    // -- OLL + PLL --------------------------------------------------------
    // Reconstruct the last-layer pattern from everything solved so far, then
    // search OLL and PLL *jointly*: a symmetric OLL is oriented by several AUFs,
    // and only some leave a state the chosen PLL set can finish. Try each
    // orienting framing and keep the one whose PLL resolves (when targeting a
    // full solve); otherwise any orienting framing will do.
    const solvedSoFar = steps
      .map((s) => s.moves)
      .filter(Boolean)
      .join(' ');
    const pattern = core.pattern(join(scramble, solvedSoFar));
    const wantPLL = PHASE_RANK[target] >= PHASE_RANK.full;

    const ollMatches = recognizeOLL(core, pattern, ollCandidates);
    let chosenOLL = ollMatches[0] ?? null;
    let chosenPLL = null as ReturnType<typeof recognizePLL>;

    for (const oll of ollMatches) {
      const pll = wantPLL ? recognizePLL(core, oll.pattern, pllCandidates) : null;
      if (!wantPLL || pll) {
        chosenOLL = oll;
        chosenPLL = pll;
        break;
      }
    }

    if (chosenOLL) {
      steps.push({
        phase: 'oll',
        label: 'OLL',
        caseName: chosenOLL.caseName,
        caseId: chosenOLL.caseId,
        moves: chosenOLL.moves,
        moveCount: countMoves(chosenOLL.moves),
        skip: chosenOLL.skip
      });
    } else {
      complete = false;
      steps.push({
        phase: 'oll',
        label: 'OLL',
        moves: '',
        moveCount: 0,
        skip: false,
        unresolved: true
      });
    }

    if (wantPLL) {
      if (chosenPLL) {
        steps.push({
          phase: 'pll',
          label: 'PLL',
          caseName: chosenPLL.caseName,
          caseId: chosenPLL.caseId,
          moves: chosenPLL.moves,
          moveCount: countMoves(chosenPLL.moves),
          skip: chosenPLL.skip
        });
      } else {
        complete = false;
        steps.push({
          phase: 'pll',
          label: 'PLL',
          moves: '',
          moveCount: 0,
          skip: false,
          unresolved: true
        });
      }
    }
  }

  const moves = steps
    .map((s) => s.moves)
    .filter(Boolean)
    .join(' ');
  return { scramble, steps, moves, moveCount: countMoves(moves), complete };
}

function join(...parts: string[]) {
  return parts.filter(Boolean).join(' ');
}

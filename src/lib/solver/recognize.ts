/**
 * Last-layer recognition. Given a cube with F2L solved, we identify the OLL and
 * PLL the *human-style* way: try the candidate algorithms (the ones the user is
 * actually learning, falling back to the full catalog) under every adjusting
 * U-turn (AUF) and keep the one that lands the expected state. This is what
 * makes the solver a teaching aid — its output is the user's own algorithms.
 */
import type { CubePattern, SolverCore } from './core';

const AUFS = ['', 'U', 'U2', "U'"];

/** A last-layer algorithm the solver may use, with the case it represents. */
export interface LLCandidate {
  caseId: string;
  name: string;
  moves: string;
}

export interface LLMatch {
  caseId?: string;
  caseName?: string;
  /** The moves to perform (AUF included), or '' for a skip. */
  moves: string;
  skip: boolean;
  /** The pattern after performing the match. */
  pattern: CubePattern;
}

const join = (...parts: string[]) => parts.filter(Boolean).join(' ');

/**
 * Every (AUF, algorithm) that orients the last layer. A symmetric OLL shape is
 * oriented by more than one AUF, and only some of those framings leave a state
 * the *chosen* PLL set can finish — so the caller tries these in turn rather
 * than committing to the first. The skip (already oriented) yields one match.
 */
export function recognizeOLL(
  core: SolverCore,
  pattern: CubePattern,
  candidates: LLCandidate[]
): LLMatch[] {
  if (core.llOriented(pattern)) return [{ moves: '', skip: true, pattern }];
  const matches: LLMatch[] = [];
  for (const auf of AUFS) {
    for (const c of candidates) {
      const moves = join(auf, c.moves);
      const next = core.applyToPattern(pattern, moves);
      if (core.llOriented(next)) {
        matches.push({ caseId: c.caseId, caseName: c.name, moves, skip: false, pattern: next });
      }
    }
  }
  return matches;
}

/** Find the PLL: the (AUF, algorithm, AUF) that solves the cube. */
export function recognizePLL(
  core: SolverCore,
  pattern: CubePattern,
  candidates: LLCandidate[]
): LLMatch | null {
  // Pure-AUF solve = a PLL skip (the layer is already permuted).
  for (const auf of AUFS) {
    const next = core.applyToPattern(pattern, auf);
    if (core.isSolved(next)) return { moves: auf, skip: true, pattern: next };
  }
  for (const pre of AUFS) {
    for (const c of candidates) {
      for (const post of AUFS) {
        const moves = join(pre, c.moves, post);
        const next = core.applyToPattern(pattern, moves);
        if (core.isSolved(next)) {
          return { caseId: c.caseId, caseName: c.name, moves, skip: false, pattern: next };
        }
      }
    }
  }
  return null;
}

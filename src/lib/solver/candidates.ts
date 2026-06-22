/**
 * Builds the OLL/PLL candidate sets the solver recognizes against, drawn from
 * the catalog. The solver prefers the algorithms the user is actually learning
 * (their personal set) and falls back to the rest of the catalog so a solution
 * always completes — see `personalFirst`.
 *
 * This module reads the catalog (and so is app-only, not part of the
 * framework-free solver core).
 */
import { casesInSet, getSet, primaryAlgorithm } from '$lib/domain';
import type { LLCandidate } from './recognize';

function candidatesFor(setId: string): LLCandidate[] {
  if (!getSet(setId)) return [];
  return casesInSet(setId).flatMap(({ case: c, label }) => {
    const alg = primaryAlgorithm(c);
    return alg ? [{ caseId: c.id, name: label, moves: alg.moves }] : [];
  });
}

/** All Full-OLL cases with their recommended algorithm. */
export function ollCandidates(): LLCandidate[] {
  return candidatesFor('oll-full');
}

/** All Full-PLL cases with their recommended algorithm. */
export function pllCandidates(): LLCandidate[] {
  return candidatesFor('pll-full');
}

/**
 * Order candidates so the user's learned cases are tried first, the rest after.
 * `learned` is the set of caseIds the user is learning or has mastered. The
 * recognizer returns the first match, so this makes the solver favour the
 * user's own repertoire while still always finding a solution.
 */
export function personalFirst(all: LLCandidate[], learned: Set<string>): LLCandidate[] {
  const own = all.filter((c) => learned.has(c.caseId));
  const rest = all.filter((c) => !learned.has(c.caseId));
  return [...own, ...rest];
}

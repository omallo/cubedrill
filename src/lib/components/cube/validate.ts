/**
 * Validates a user-authored algorithm: does it actually solve the case?
 *
 * A case is defined by its reference algorithm — the case position is
 * `invert(reference)` from solved, so applying the reference returns to solved.
 * A candidate therefore solves the case iff applying it from the same position
 * lands on solved too (tolerating a net whole-cube rotation, since equivalent
 * algorithms may end in a rotated frame). Equivalently: the candidate has the
 * same effect as the reference.
 *
 * Lives next to the cube components so the heavy cubing.js import stays out of
 * the main bundle (loaded only on the algorithms route).
 */
import { Alg } from 'cubing/alg';
import { cube3x3x3 } from 'cubing/puzzles';

interface Validator {
  check: (reference: string, candidate: string) => boolean;
}

let validatorPromise: Promise<Validator> | null = null;

async function build(): Promise<Validator> {
  const kpuzzle = await cube3x3x3.kpuzzle();
  const solved = kpuzzle.defaultPattern();

  // Keys of solved under every whole-cube rotation, to tolerate a net rotation.
  const rots = new Set<string>(['']);
  let frontier = [''];
  for (let d = 0; d < 3; d++) {
    const next: string[] = [];
    for (const seq of frontier)
      for (const g of ['x', "x'", 'y', "y'", 'z', "z'"]) next.push(seq ? `${seq} ${g}` : g);
    frontier = next;
    for (const a of next) rots.add(a);
  }
  const solvedKeys = new Set(
    [...rots].map((r) => JSON.stringify(solved.applyAlg(new Alg(r)).patternData))
  );

  const check = (reference: string, candidate: string): boolean => {
    const setup = new Alg(reference).invert();
    const end = solved.applyAlg(setup).applyAlg(new Alg(candidate));
    return solvedKeys.has(JSON.stringify(end.patternData));
  };

  return { check };
}

export type ValidationResult = { valid: boolean; error?: string };

/**
 * True when `candidate` solves the same case as `reference`. Returns a friendly
 * error when the candidate isn't valid cube notation.
 */
export async function validateAlgorithm(
  reference: string,
  candidate: string
): Promise<ValidationResult> {
  const moves = candidate.trim();
  if (!moves) return { valid: false, error: 'Enter an algorithm.' };
  let parses = true;
  try {
    // Throws on malformed notation.
    new Alg(moves).expand();
  } catch {
    parses = false;
  }
  if (!parses) return { valid: false, error: 'Not valid cube notation.' };

  try {
    const { check } = await (validatorPromise ??= build());
    return check(reference, moves)
      ? { valid: true }
      : { valid: false, error: "This doesn't solve the case." };
  } catch {
    return { valid: false, error: 'Could not validate this algorithm.' };
  }
}

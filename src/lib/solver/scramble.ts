/**
 * Scramble generation for the Solver and Solves views. Beyond a full scramble
 * we produce *specialized* scrambles that leave part of the cube solved, by
 * generating a full scramble and solving up to the desired phase (so the
 * remainder is genuinely random), or — for a single last F2L pair — by
 * displacing one pair from a solved cube via a catalog F2L case.
 *
 * App-only (reads the catalog and the solver).
 */
import { Alg } from 'cubing/alg';
import { randomScrambleForEvent } from 'cubing/scramble';
import { casesInSet, primaryAlgorithm, slotsForCase, type F2LSlot } from '$lib/domain';
import { getCore } from './core';
import { solve } from './solve';
import { ollCandidates, pllCandidates } from './candidates';

export type ScrambleType = 'full' | 'cross-solved' | 'f2l-solved' | 'oll-solved' | 'last-pair';

export interface ScrambleOption {
  id: ScrambleType;
  label: string;
  /** What the solver is left to do from this scramble. */
  description: string;
}

/** The selectable scramble types, in increasing amount-pre-solved order. */
export const SCRAMBLE_OPTIONS: ScrambleOption[] = [
  { id: 'full', label: 'Full scramble', description: 'A complete solve, cross to PLL.' },
  { id: 'cross-solved', label: 'Cross solved', description: 'Drill F2L, OLL and PLL.' },
  { id: 'f2l-solved', label: 'F2L solved', description: 'Last-layer practice (OLL + PLL).' },
  { id: 'oll-solved', label: 'OLL solved', description: 'PLL practice.' },
  { id: 'last-pair', label: 'Last F2L pair', description: 'Insert a single F2L pair.' }
];

const AUFS = ['', 'U', 'U2', "U'"];
const pick = <T>(xs: T[]): T => xs[Math.floor(Math.random() * xs.length)];

/** Generate a scramble of the given type. Returns a clean, applicable sequence. */
export async function generateScramble(type: ScrambleType): Promise<string> {
  if (type === 'last-pair') return lastPairScramble();

  const full = (await randomScrambleForEvent('333')).toString();
  if (type === 'full') return full;

  const target = type === 'cross-solved' ? 'cross' : type === 'f2l-solved' ? 'f2l' : 'oll';
  const solution = await solve(full, {
    target,
    ollCandidates: ollCandidates(),
    pllCandidates: pllCandidates()
  });
  // Scramble = full scramble followed by the solution up to the target phase,
  // leaving everything past that phase randomly scrambled.
  const core = await getCore();
  return core.normalize(`${full} ${solution.moves}`).trim();
}

/** A cube with the cross and three F2L pairs solved, one pair displaced. */
async function lastPairScramble(): Promise<string> {
  const core = await getCore();
  const f2l = casesInSet('f2l-standard');
  // Try random cases until we get a clean, rotation-free, valid displacement.
  for (let i = 0; i < 40; i++) {
    const { case: c } = pick(f2l);
    const slots = slotsForCase(c);
    if (!slots.length) continue;
    const slot = pick(slots) as F2LSlot;
    const alg = primaryAlgorithm(c, slot);
    if (!alg) continue;
    const scramble = core
      .normalize(`${pick(AUFS)} ${new Alg(alg.moves).invert().toString()}`)
      .trim();
    if (scramble) return scramble;
  }
  return '';
}

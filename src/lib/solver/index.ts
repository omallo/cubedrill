/**
 * Public entry point for the CFOP solver. Importing this pulls in cubing.js, so
 * it is only imported by the Solver and Solves routes (never the shared barrels)
 * to keep cubing out of the main bundle.
 */
export { getCore, SLOTS, type Slot, type CubeState } from './core';
export { solve, type Solution, type SolveStep, type SolvePhase, type SolveTarget } from './solve';
export { type LLCandidate } from './recognize';
export { ollCandidates, pllCandidates, personalFirst } from './candidates';
export {
  generateScramble,
  SCRAMBLE_OPTIONS,
  type ScrambleType,
  type ScrambleOption
} from './scramble';

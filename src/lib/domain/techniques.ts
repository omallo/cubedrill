/**
 * Techniques — the conceptual phases of the method (Cross, intuitive F2L) that
 * are learned as understanding rather than enumerated algorithm cases. Each is
 * tutorial-like: an ordered list of sections (concepts / tricks) you work
 * through. The learning path references a technique by id (its milestone steps),
 * and the `/techniques` pages render it.
 *
 * This data holds the *structure* (sections with id/name/short description) —
 * which drives the path, the index, and a page's section anchors. The richer
 * tutorial prose (and any embedded cubes/videos) is authored in the technique
 * page component and fleshed out over time, like the algorithm seed data.
 */
import type { PhaseId } from './types';

/** One section of a technique — a concept or trick within it. */
export interface TechniqueSection {
  /** Unique within the technique; also the page anchor. */
  id: string;
  name: string;
  description?: string;
}

export interface Technique {
  id: string; // 'cross' | 'intuitive-f2l'
  phaseId: PhaseId;
  name: string;
  description?: string;
  sections: TechniqueSection[];
}

export const techniques: Technique[] = [
  {
    id: 'cross',
    phaseId: 'cross',
    name: 'Cross',
    description:
      'The foundation of every solve: place the four bottom-layer edges quickly and accurately. Intuitive, but with patterns and planning that turn it into a real speed lever.',
    sections: [
      {
        id: 'basics',
        name: 'Building the cross',
        description: 'Place each cross edge relative to its centers — no algorithms, just intent.'
      },
      {
        id: 'color',
        name: 'Cross color & where to start',
        description:
          'Picking a cross color (and working toward color neutrality) for an easier start.'
      },
      {
        id: 'inspection',
        name: 'Planning in inspection',
        description:
          'Solve the cross without looking by planning it during the 15-second inspection.'
      },
      {
        id: 'efficiency',
        name: 'Efficient cross',
        description: 'Fewer moves, fewer rotations — keep the solution short and slot-friendly.'
      },
      {
        id: 'x-cross',
        name: 'X-Cross',
        description: 'Extend the cross to also solve one F2L pair in the same sequence.'
      }
    ]
  },
  {
    id: 'intuitive-f2l',
    phaseId: 'f2l',
    name: 'Intuitive F2L',
    description:
      'Pair a corner with its edge and insert into the slot — solving the first two layers by understanding the pieces rather than memorizing algorithms.',
    sections: [
      {
        id: 'concept',
        name: 'Pair and insert',
        description: 'The core idea: build the corner-edge pair, then put it into its slot.'
      },
      {
        id: 'positions',
        name: 'The basic case types',
        description: 'The handful of situations a pair can be in, and how to reason about each.'
      },
      {
        id: 'look-ahead',
        name: 'Look-ahead',
        description:
          'Tracking the next pair while solving the current one to keep the solve flowing.'
      },
      {
        id: 'next',
        name: 'Toward the algorithmic approach',
        description: 'When intuition is solid, learn the optimized per-slot algorithms.'
      }
    ]
  }
];

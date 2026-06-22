/**
 * The learning path — a curated, ordered sequence of things to learn, mapped
 * onto the Coverage dimension (see TRAINING.md §5–§7). It is the static-curation
 * half of "learn next": the catalog says what exists, the path says in what order
 * to pick it up, and `learnNext()` crosses it with the user's learning status to
 * point at the next case to drill.
 *
 * This is data + a pure derivation, deliberately:
 *   - No personal persistence of its own — it reads `personal.status` via a
 *     passed-in lookup, so it stays SSR-safe and trivially testable.
 *   - No goals / tracking / suggested-trainings — those layer on top later.
 *
 * Two step kinds:
 *   - `coverage` — backed by a catalog set (optionally narrowed to one F2L slot).
 *     Progress is mastered/total over the set's cases; "group by group, in order"
 *     is intrinsic (we walk the set's groups in catalog order), not curated here.
 *   - `milestone` — a conceptual phase (Cross, intuitive F2L) with no enumerated
 *     cases and nothing drillable. It carries an optional ordered sub-checklist
 *     (`items`). For now milestones are non-blocking and assumed complete (the
 *     "user knows the beginner method" assumption); per-item completion tracking
 *     can land later behind the `milestoneDone` hook without reshaping anything.
 */
import { casesInSet, caseGroupsInSet } from './index';
import type { CaseId, F2LSlot, LearningStatus, PhaseId, SetGroup, SetId } from './types';

// ---------------------------------------------------------------------------
// Path data shape
// ---------------------------------------------------------------------------

export type PathStep = CoverageStep | MilestoneStep;

interface PathStepBase {
  /** Stable id — used for "you are here", deep-links, and milestone completion. */
  id: string;
  label: string;
  description?: string;
}

/** Backed by catalog cases; coverage is computed from learning status. */
export interface CoverageStep extends PathStepBase {
  kind: 'coverage';
  setId: SetId;
  /** F2L only: narrow the set to one slot. Omit ⇒ the whole set (OLL/PLL). */
  slot?: F2LSlot;
}

/** A conceptual phase (Cross, intuitive F2L) — no cases, not drillable. */
export interface MilestoneStep extends PathStepBase {
  kind: 'milestone';
  /** The conceptual phase this belongs to (for section/icon). */
  phaseId: PhaseId;
  /** Optional ordered sub-checklist (e.g. Cross → basic, planning, X-cross). */
  items?: MilestoneItem[];
}

export interface MilestoneItem {
  id: string;
  label: string;
  description?: string;
}

/**
 * The canonical CFOP learning path. Array order *is* the learn order.
 *
 * Curated content (like the catalog) — editable, and the seed for future
 * level-aware / alternative tracks. Assumes (for now) the beginner method is
 * known; a future "what's your level?" step would pick a different entry point.
 *
 * FL/BL are not separate steps: the FR/BR algs transfer by mirroring (see
 * `f2l-slots.ts`), so the path only sequences the two authored slots.
 */
export const cfopLearningPath: PathStep[] = [
  {
    kind: 'milestone',
    id: 'cross',
    label: 'Cross',
    phaseId: 'cross',
    description: 'Solve the four bottom-layer edges — the foundation every solve starts from.',
    items: [
      { id: 'basic', label: 'Basic cross', description: 'Build the cross reliably, any color.' },
      {
        id: 'inspection',
        label: 'Plan the cross in inspection',
        description: 'Solve the cross without looking — plan it in the 15s inspection.'
      },
      {
        id: 'x-cross',
        label: 'X-Cross',
        description: 'Solve the cross and one F2L pair together in one go.'
      }
    ]
  },
  {
    kind: 'milestone',
    id: 'intuitive-f2l',
    label: 'Intuitive F2L',
    phaseId: 'f2l',
    description: 'Pair and insert each corner+edge by understanding, not memorized algorithms.'
  },

  { kind: 'coverage', id: 'two-look-oll', label: '2-Look OLL', setId: 'oll-2look' },
  { kind: 'coverage', id: 'two-look-pll', label: '2-Look PLL', setId: 'pll-2look' },
  {
    kind: 'coverage',
    id: 'f2l-fr',
    label: 'Standard F2L — FR slot',
    setId: 'f2l-standard',
    slot: 'FR'
  },
  { kind: 'coverage', id: 'full-pll', label: 'Full PLL', setId: 'pll-full' },
  {
    kind: 'coverage',
    id: 'f2l-br',
    label: 'Standard F2L — BR slot',
    setId: 'f2l-standard',
    slot: 'BR'
  },
  { kind: 'coverage', id: 'full-oll', label: 'Full OLL', setId: 'oll-full' }
];

// ---------------------------------------------------------------------------
// learnNext — cross the path with learning status
// ---------------------------------------------------------------------------

export type StepState = 'not-started' | 'in-progress' | 'complete';

export interface StepProgress {
  step: PathStep;
  state: StepState;
  /** Coverage: mastered units. Milestone: 0 (until per-item tracking lands). */
  mastered: number;
  /** Coverage: units currently being learned. Milestone: 0. */
  learning: number;
  /** Coverage: units in scope. Milestone: 0. */
  total: number;
}

/** The single recommended next case to drill — feeds the trainer deep-link. */
export interface NextDrill {
  stepId: string;
  setId: SetId;
  slot?: F2LSlot;
  /** First group containing a not-mastered case, if the set is grouped. */
  groupId?: string;
  /** First not-mastered case within that group, in catalog order. */
  caseId: CaseId;
}

export interface PathProgress {
  steps: StepProgress[];
  /** First step that isn't complete (any kind) — the "you are here" marker, or
   *  `steps.length` when the whole path is complete. */
  currentStepIndex: number;
  /** First not-mastered case in the first incomplete coverage step, or null. */
  nextDrill: NextDrill | null;
}

export type StatusLookup = (caseId: CaseId, slot?: F2LSlot) => LearningStatus;

interface LearnNextOptions {
  /** Override milestone completion. Defaults to `true` (assumed known) for now. */
  milestoneDone?: (stepId: string) => boolean;
}

/** Coverage of a single coverage step: mastered/learning/total over the set's cases. */
function coverageOf(
  step: CoverageStep,
  status: StatusLookup
): { mastered: number; learning: number; total: number } {
  const cases = casesInSet(step.setId);
  let mastered = 0;
  let learning = 0;
  for (const { case: c } of cases) {
    const s = status(c.id, step.slot);
    if (s === 'mastered') mastered++;
    else if (s === 'learning') learning++;
  }
  return { mastered, learning, total: cases.length };
}

function stateOf(mastered: number, total: number): StepState {
  if (total > 0 && mastered >= total) return 'complete';
  return mastered > 0 ? 'in-progress' : 'not-started';
}

/** The first not-mastered case of a coverage step, walked group by group. */
function nextDrillIn(step: CoverageStep, status: StatusLookup): NextDrill | null {
  for (const { group, cases } of caseGroupsInSet(step.setId)) {
    for (const { case: c } of cases) {
      if (status(c.id, step.slot) !== 'mastered') {
        return {
          stepId: step.id,
          setId: step.setId,
          slot: step.slot,
          groupId: group?.id,
          caseId: c.id
        };
      }
    }
  }
  return null;
}

/** Per-group coverage within a coverage step — for expandable stage detail. */
export interface GroupProgress {
  group?: SetGroup;
  state: StepState;
  mastered: number;
  learning: number;
  total: number;
}

/**
 * A coverage step broken down by group, in catalog order — lets the UI expand a
 * stage into the groups you learn it by. Slot-aware, like the step itself.
 */
export function coverageStepGroups(step: CoverageStep, status: StatusLookup): GroupProgress[] {
  return caseGroupsInSet(step.setId).map(({ group, cases }) => {
    let mastered = 0;
    let learning = 0;
    for (const { case: c } of cases) {
      const s = status(c.id, step.slot);
      if (s === 'mastered') mastered++;
      else if (s === 'learning') learning++;
    }
    return {
      group,
      state: stateOf(mastered, cases.length),
      mastered,
      learning,
      total: cases.length
    };
  });
}

/**
 * Cross the path with the user's learning status. Pure over `(path, status)` —
 * pass `personal.status` as the lookup. Returns per-step progress, the current
 * step marker, and the single next case to drill.
 *
 * Milestones never block and never produce a drill: their state comes from
 * `opts.milestoneDone` (default: complete). `nextDrill` is always a coverage case.
 */
export function learnNext(
  path: PathStep[],
  status: StatusLookup,
  opts: LearnNextOptions = {}
): PathProgress {
  const milestoneDone = opts.milestoneDone ?? (() => true);

  const steps: StepProgress[] = path.map((step) => {
    if (step.kind === 'coverage') {
      const { mastered, learning, total } = coverageOf(step, status);
      return { step, state: stateOf(mastered, total), mastered, learning, total };
    }
    const done = milestoneDone(step.id);
    return { step, state: done ? 'complete' : 'not-started', mastered: 0, learning: 0, total: 0 };
  });

  const currentStepIndex = steps.findIndex((s) => s.state !== 'complete');

  let nextDrill: NextDrill | null = null;
  for (const { step, state } of steps) {
    if (step.kind === 'coverage' && state !== 'complete') {
      nextDrill = nextDrillIn(step, status);
      if (nextDrill) break;
    }
  }

  return {
    steps,
    currentStepIndex: currentStepIndex === -1 ? steps.length : currentStepIndex,
    nextDrill
  };
}

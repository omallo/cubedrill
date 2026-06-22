import { browser } from '$app/environment';
import { casesInSet, type LearningStatus, type SetId } from '$lib/domain';
import { personal } from '$lib/personal.svelte';

const STORAGE_KEY = 'cubedrill-goals';

/**
 * A coverage goal: bring every case in a set up to a target status. This is the
 * Coverage half of the learning path (see TRAINING.md §6–§7) — fluency/timing
 * goals are deferred to the smart-cube era and deliberately not modelled here.
 */
export interface Goal {
  id: string;
  setId: SetId;
  /** The status every case in the set should reach. */
  target: Exclude<LearningStatus, 'not-learned'>;
  createdAt: string;
}

export interface GoalProgress {
  /** Cases that have reached (or exceeded) the target. */
  done: number;
  total: number;
  complete: boolean;
}

/** Does a case's status meet the goal target? Mastered satisfies a learning goal. */
function meets(status: LearningStatus, target: Goal['target']): boolean {
  if (target === 'learning') return status !== 'not-learned';
  return status === 'mastered';
}

function isGoal(v: unknown): v is Goal {
  if (!v || typeof v !== 'object') return false;
  const g = v as Record<string, unknown>;
  return (
    typeof g.id === 'string' &&
    typeof g.setId === 'string' &&
    (g.target === 'learning' || g.target === 'mastered')
  );
}

/**
 * Local-first training goals (mirrors the other stores). Reactive list mirrored
 * to localStorage; progress is derived live from the personal layer.
 */
class GoalsStore {
  list = $state<Goal[]>([]);

  constructor() {
    if (!browser) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed?.list)) this.list = parsed.list.filter(isGoal);
    } catch {
      // Corrupt storage — start clean rather than crash.
    }
  }

  /** Add a goal, unless an identical (set, target) goal already exists. */
  add(setId: SetId, target: Goal['target']): void {
    if (this.list.some((g) => g.setId === setId && g.target === target)) return;
    this.list = [
      ...this.list,
      { id: crypto.randomUUID(), setId, target, createdAt: new Date().toISOString() }
    ];
    this.#save();
  }

  remove(id: string): void {
    this.list = this.list.filter((g) => g.id !== id);
    this.#save();
  }

  has(setId: SetId, target: Goal['target']): boolean {
    return this.list.some((g) => g.setId === setId && g.target === target);
  }

  /** Live progress for a goal, derived from the personal layer. */
  progress(goal: Goal): GoalProgress {
    const cases = casesInSet(goal.setId);
    let done = 0;
    for (const { case: c } of cases) {
      if (meets(personal.caseStatus(c.id), goal.target)) done++;
    }
    return { done, total: cases.length, complete: cases.length > 0 && done >= cases.length };
  }

  #save(): void {
    if (!browser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ list: this.list }));
  }
}

export const goals = new GoalsStore();

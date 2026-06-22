import { browser } from '$app/environment';
import type { CaseId, F2LSlot } from '$lib/domain';

const STORAGE_KEY = 'cubedrill-stats';

/** Self-rated outcome of a recall attempt. */
export type RecallGrade = 'got' | 'hesitated' | 'blanked';

export const RECALL_GRADES: RecallGrade[] = ['got', 'hesitated', 'blanked'];

/**
 * Aggregate recall-drill stats for one *tracking unit* (a case, or case+slot
 * for F2L — same keying as the personal store). Kept as running aggregates
 * rather than a full attempt log: enough to power streaks, accuracy and
 * weak-case ranking without unbounded growth.
 */
export type RecallStat = {
  attempts: number;
  /** Number of 'got' grades (clean recalls). */
  got: number;
  /** Consecutive 'got' grades up to and including the latest attempt. */
  streak: number;
  /** Sum of recall latencies (ms), for the running average. */
  totalMs: number;
  /** Fastest clean ('got') recall in ms, or undefined if never recalled cleanly. */
  bestMs?: number;
  /** ISO timestamp of the most recent attempt. */
  lastAt: string;
};

function entryKey(caseId: CaseId, slot?: F2LSlot): string {
  return slot ? `${caseId}:${slot}` : caseId;
}

function isStat(value: unknown): value is RecallStat {
  if (!value || typeof value !== 'object') return false;
  const s = value as Record<string, unknown>;
  return (
    typeof s.attempts === 'number' &&
    typeof s.got === 'number' &&
    typeof s.streak === 'number' &&
    typeof s.totalMs === 'number'
  );
}

/** Average recall latency in ms across all attempts (0 if none). */
export function avgMs(stat: RecallStat | undefined): number {
  return stat && stat.attempts ? stat.totalMs / stat.attempts : 0;
}

/** Recall accuracy in [0, 1] — share of attempts graded 'got' (0 if none). */
export function accuracy(stat: RecallStat | undefined): number {
  return stat && stat.attempts ? stat.got / stat.attempts : 0;
}

/**
 * Recall-drill statistics (local-first), separate from the personal layer:
 * grades are *feedback only* and never mutate learning status (which stays
 * user-controlled via the status chips). Mirrors `personal.svelte.ts`:
 * reactive record keyed by tracking unit, mirrored to localStorage on change.
 */
class StatsStore {
  /** Recall stats keyed by `entryKey`. */
  recall = $state<Record<string, RecallStat>>({});

  constructor() {
    if (!browser) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const recall = parsed?.recall;
      if (recall && typeof recall === 'object') {
        for (const [key, stat] of Object.entries(recall)) {
          if (isStat(stat)) this.recall[key] = stat;
        }
      }
    } catch {
      // Corrupt storage — start clean rather than crash.
    }
  }

  /** Recall stats for a tracking unit, or undefined if never drilled. */
  get(caseId: CaseId, slot?: F2LSlot): RecallStat | undefined {
    return this.recall[entryKey(caseId, slot)];
  }

  /** Record one graded recall attempt and fold it into the unit's aggregates. */
  record(caseId: CaseId, slot: F2LSlot | undefined, grade: RecallGrade, recallMs: number): void {
    const key = entryKey(caseId, slot);
    const prev = this.recall[key];
    const got = grade === 'got';
    this.recall[key] = {
      attempts: (prev?.attempts ?? 0) + 1,
      got: (prev?.got ?? 0) + (got ? 1 : 0),
      streak: got ? (prev?.streak ?? 0) + 1 : 0,
      totalMs: (prev?.totalMs ?? 0) + recallMs,
      bestMs: got ? Math.min(prev?.bestMs ?? Infinity, recallMs) : prev?.bestMs,
      lastAt: new Date().toISOString()
    };
    this.#save();
  }

  #save(): void {
    if (!browser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ recall: this.recall }));
  }
}

export const stats = new StatsStore();

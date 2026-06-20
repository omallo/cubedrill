import { browser } from '$app/environment';
import type { CaseId, LearningStatus, PersonalEntry } from '$lib/domain';

const STORAGE_KEY = 'cubedrill-personal';

/** Status progression used by `cycle()`. */
export const STATUS_ORDER: LearningStatus[] = ['not-learned', 'learning', 'mastered'];

function isStatus(value: unknown): value is LearningStatus {
  return value === 'not-learned' || value === 'learning' || value === 'mastered';
}

/**
 * The user's personal layer (local-first). For now it tracks per-case learning
 * status; chosen/authored algorithms will join later. State lives in memory as a
 * reactive record and is mirrored to localStorage on every change. A single
 * shared instance is exported as `personal`.
 *
 * Status is keyed by `caseId`, so a case shared across sets (e.g. OLL 27 in both
 * Full OLL and 2-Look OLL) carries one status everywhere.
 */
class PersonalStore {
  /** Keyed by caseId. Absence implies 'not-learned'. */
  entries = $state<Record<CaseId, PersonalEntry>>({});

  constructor() {
    if (!browser) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const entries = parsed?.entries;
      if (entries && typeof entries === 'object') {
        for (const [caseId, entry] of Object.entries(entries)) {
          if (entry && isStatus((entry as PersonalEntry).status)) {
            this.entries[caseId] = entry as PersonalEntry;
          }
        }
      }
    } catch {
      // Corrupt storage — start clean rather than crash.
    }
  }

  status(caseId: CaseId): LearningStatus {
    return this.entries[caseId]?.status ?? 'not-learned';
  }

  setStatus(caseId: CaseId, status: LearningStatus): void {
    if (status === 'not-learned') {
      // Absence is the canonical 'not-learned' — drop the entry to keep storage lean.
      delete this.entries[caseId];
    } else {
      this.entries[caseId] = {
        ...this.entries[caseId],
        caseId,
        status,
        updatedAt: new Date().toISOString()
      };
    }
    this.#save();
  }

  /** Advance a case to the next status in STATUS_ORDER, wrapping around. */
  cycle(caseId: CaseId): void {
    const current = this.status(caseId);
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(current) + 1) % STATUS_ORDER.length];
    this.setStatus(caseId, next);
  }

  /** Count cases (by id) currently at the given status. */
  count(caseIds: Iterable<CaseId>, status: LearningStatus): number {
    let n = 0;
    for (const id of caseIds) if (this.status(id) === status) n++;
    return n;
  }

  #save(): void {
    if (!browser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ entries: this.entries }));
  }
}

export const personal = new PersonalStore();

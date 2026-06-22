import { browser } from '$app/environment';
import {
  slotsForCase,
  getCase,
  primaryAlgorithm,
  type Algorithm,
  type Case,
  type CaseId,
  type F2LSlot,
  type LearningStatus,
  type PersonalEntry
} from '$lib/domain';

const STORAGE_KEY = 'cubedrill-personal';

/** Status progression used by `cycle()`. */
export const STATUS_ORDER: LearningStatus[] = ['not-learned', 'learning', 'mastered'];

function isStatus(value: unknown): value is LearningStatus {
  return value === 'not-learned' || value === 'learning' || value === 'mastered';
}

/** Storage key for a tracking unit: per-slot for F2L, bare caseId otherwise. */
function entryKey(caseId: CaseId, slot?: F2LSlot): string {
  return slot ? `${caseId}:${slot}` : caseId;
}

/**
 * The user's personal layer (local-first). It tracks learning status per
 * *tracking unit*: a case+slot for F2L (each slot is learned independently) and
 * a bare case for OLL/PLL. State lives in memory as a reactive record keyed by
 * `entryKey` and is mirrored to localStorage on every change. A single shared
 * instance is exported as `personal`.
 *
 * Per-slot status is keyed by `caseId:slot` (e.g. `f2l-21:FR`); unsliced cases
 * by bare `caseId`, so a case shared across sets (e.g. OLL 27 in both Full OLL
 * and 2-Look OLL) carries one status everywhere. The slot-agnostic "is this case
 * learned?" view is `caseStatus`, which rolls up a case's authored slots.
 */
class PersonalStore {
  /** Keyed by `entryKey`. Absence implies 'not-learned'. */
  entries = $state<Record<string, PersonalEntry>>({});
  /** User-authored algorithms, keyed by caseId (F2L entries carry a `slot`). */
  authored = $state<Record<CaseId, Algorithm[]>>({});
  /** Chosen algorithm per tracking unit, identified by its move string. */
  choices = $state<Record<string, string>>({});

  constructor() {
    if (!browser) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const entries = parsed?.entries;
      if (entries && typeof entries === 'object') {
        for (const [key, entry] of Object.entries(entries)) {
          if (entry && isStatus((entry as PersonalEntry).status)) {
            this.entries[key] = entry as PersonalEntry;
          }
        }
      }
      if (parsed?.authored && typeof parsed.authored === 'object') {
        for (const [id, algs] of Object.entries(parsed.authored)) {
          if (Array.isArray(algs)) {
            this.authored[id] = algs.filter(
              (a): a is Algorithm => !!a && typeof (a as Algorithm).moves === 'string'
            );
          }
        }
      }
      if (parsed?.choices && typeof parsed.choices === 'object') {
        for (const [key, moves] of Object.entries(parsed.choices)) {
          if (typeof moves === 'string') this.choices[key] = moves;
        }
      }
    } catch {
      // Corrupt storage — start clean rather than crash.
    }
  }

  /** Status of a single tracking unit (a case, or case+slot for F2L). */
  status(caseId: CaseId, slot?: F2LSlot): LearningStatus {
    return this.entries[entryKey(caseId, slot)]?.status ?? 'not-learned';
  }

  setStatus(caseId: CaseId, slot: F2LSlot | undefined, status: LearningStatus): void {
    const key = entryKey(caseId, slot);
    if (status === 'not-learned') {
      // Absence is the canonical 'not-learned' — drop the entry to keep storage lean.
      delete this.entries[key];
    } else {
      this.entries[key] = {
        ...this.entries[key],
        caseId,
        ...(slot ? { slot } : {}),
        status,
        updatedAt: new Date().toISOString()
      };
    }
    this.#save();
  }

  /** Advance a tracking unit to the next status in STATUS_ORDER, wrapping around. */
  cycle(caseId: CaseId, slot?: F2LSlot): void {
    const current = this.status(caseId, slot);
    const next = STATUS_ORDER[(STATUS_ORDER.indexOf(current) + 1) % STATUS_ORDER.length];
    this.setStatus(caseId, slot, next);
  }

  /**
   * Case-level (learning-path) status, used for the headline progress on the
   * overview and set header. Taken from the case's base slot — FR for F2L —
   * since knowing a case in the front-right slot means you can solve it (back
   * slots are a y/y' away). Back-slot status is tracked independently in the
   * slot view and does not gate this. Unsliced cases (OLL/PLL) return their
   * single status.
   */
  caseStatus(caseId: CaseId): LearningStatus {
    const c = getCase(caseId);
    const slots = c ? slotsForCase(c) : [];
    if (slots.length === 0) return this.status(caseId);
    return this.status(caseId, slots[0]);
  }

  /** Count cases (by id) whose rolled-up status equals the given status. */
  count(caseIds: Iterable<CaseId>, status: LearningStatus): number {
    let n = 0;
    for (const id of caseIds) if (this.caseStatus(id) === status) n++;
    return n;
  }

  // --- Authored algorithms & selection -------------------------------------

  /**
   * The algorithms selectable for a case in a given slot context: the built-in
   * ones (filtered to the slot for F2L) followed by the user's authored ones,
   * each flagged as `authored` and whether it's the current `chosen` pick.
   */
  algorithmsFor(c: Case, slot?: F2LSlot): { alg: Algorithm; authored: boolean; chosen: boolean }[] {
    const builtin = c.algorithms.filter((a) => (slot ? a.slot === slot : true));
    const authored = (this.authored[c.id] ?? []).filter((a) => (slot ? a.slot === slot : true));
    const chosenMoves = this.choices[entryKey(c.id, slot)];
    const fallback = primaryAlgorithm(c, slot)?.moves;
    const effective = chosenMoves ?? fallback;
    return [
      ...builtin.map((alg) => ({ alg, authored: false, chosen: alg.moves === effective })),
      ...authored.map((alg) => ({ alg, authored: true, chosen: alg.moves === effective }))
    ];
  }

  /** The algorithm the user drills/solves with for a unit: their pick, else the
   *  recommended built-in one. */
  chosenAlgorithm(c: Case, slot?: F2LSlot): Algorithm | undefined {
    const chosenMoves = this.choices[entryKey(c.id, slot)];
    if (chosenMoves) {
      const all = [...c.algorithms, ...(this.authored[c.id] ?? [])];
      const match = all.find((a) => a.moves === chosenMoves);
      if (match) return match;
    }
    return primaryAlgorithm(c, slot);
  }

  /** Pick (or, if already chosen, keep) an algorithm for a unit by its moves. */
  setChoice(caseId: CaseId, slot: F2LSlot | undefined, moves: string): void {
    this.choices[entryKey(caseId, slot)] = moves;
    this.#save();
  }

  /** Add a user-authored algorithm to a case (no-op if an identical one exists). */
  addAuthored(caseId: CaseId, alg: Algorithm): void {
    const list = this.authored[caseId] ?? [];
    if (list.some((a) => a.moves === alg.moves && a.slot === alg.slot)) return;
    this.authored[caseId] = [...list, alg];
    this.#save();
  }

  /** Remove an authored algorithm, clearing any choice that pointed at it. */
  removeAuthored(caseId: CaseId, moves: string): void {
    this.authored[caseId] = (this.authored[caseId] ?? []).filter((a) => a.moves !== moves);
    if (this.authored[caseId].length === 0) delete this.authored[caseId];
    for (const [key, m] of Object.entries(this.choices)) {
      if ((key === caseId || key.startsWith(`${caseId}:`)) && m === moves) delete this.choices[key];
    }
    this.#save();
  }

  #save(): void {
    if (!browser) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ entries: this.entries, authored: this.authored, choices: this.choices })
    );
  }
}

export const personal = new PersonalStore();

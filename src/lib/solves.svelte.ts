import { browser } from '$app/environment';
import type { ScrambleType } from '$lib/solver';

const STORAGE_KEY = 'cubedrill-solves';

export type Penalty = 'none' | '+2' | 'dnf';

/** One recorded solve attempt. */
export interface Solve {
  id: string;
  /** Raw solve time in milliseconds (before penalty). */
  ms: number;
  penalty: Penalty;
  scramble: string;
  scrambleType: ScrambleType;
  /** ISO timestamp. */
  createdAt: string;
}

/** Effective time including penalty; Infinity for a DNF (excluded from bests). */
export function effectiveMs(s: Solve): number {
  if (s.penalty === 'dnf') return Infinity;
  return s.ms + (s.penalty === '+2' ? 2000 : 0);
}

/** Format milliseconds as a cubing time string (e.g. 12.34, 1:05.42, DNF). */
export function formatTime(ms: number): string {
  if (!isFinite(ms)) return 'DNF';
  const total = ms / 1000;
  if (total < 60) return total.toFixed(2);
  const m = Math.floor(total / 60);
  const s = (total % 60).toFixed(2).padStart(5, '0');
  return `${m}:${s}`;
}

/**
 * WCA-style average of a window: drop the best and worst, mean the rest.
 * A single DNF is dropped as the worst; two or more DNFs make the average DNF.
 * Returns NaN when there aren't enough solves.
 */
function windowAverage(solves: Solve[], n: number): number {
  if (solves.length < n) return NaN;
  const window = solves.slice(0, n).map(effectiveMs);
  const dnfs = window.filter((m) => !isFinite(m)).length;
  if (dnfs >= 2) return Infinity;
  const sorted = [...window].sort((a, b) => a - b);
  const trimmed = sorted.slice(1, n - 1); // drop best + worst
  return trimmed.reduce((a, b) => a + b, 0) / trimmed.length;
}

function isSolve(v: unknown): v is Solve {
  if (!v || typeof v !== 'object') return false;
  const s = v as Record<string, unknown>;
  return typeof s.id === 'string' && typeof s.ms === 'number' && typeof s.createdAt === 'string';
}

/**
 * Local-first solve history (mirrors the personal/stats stores): a reactive
 * list mirrored to localStorage on change. Newest first. Powers the timer's
 * session stats (best, mean, ao5, ao12) and history.
 */
class SolvesStore {
  /** All solves, newest first. */
  list = $state<Solve[]>([]);

  constructor() {
    if (!browser) return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      if (Array.isArray(parsed?.list)) this.list = parsed.list.filter(isSolve);
    } catch {
      // Corrupt storage — start clean rather than crash.
    }
  }

  add(solve: Omit<Solve, 'id' | 'createdAt'>): void {
    this.list = [
      {
        ...solve,
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString()
      },
      ...this.list
    ];
    this.#save();
  }

  setPenalty(id: string, penalty: Penalty): void {
    this.list = this.list.map((s) => (s.id === id ? { ...s, penalty } : s));
    this.#save();
  }

  remove(id: string): void {
    this.list = this.list.filter((s) => s.id !== id);
    this.#save();
  }

  clear(): void {
    this.list = [];
    this.#save();
  }

  /** Best (lowest effective) time across all solves, or NaN if none count. */
  get best(): number {
    const times = this.list.map(effectiveMs).filter(isFinite);
    return times.length ? Math.min(...times) : NaN;
  }

  /** Mean of all non-DNF solves, or NaN if none. */
  get mean(): number {
    const times = this.list.map(effectiveMs).filter(isFinite);
    return times.length ? times.reduce((a, b) => a + b, 0) / times.length : NaN;
  }

  /** Rolling average of 5 (most recent), WCA-trimmed. */
  get ao5(): number {
    return windowAverage(this.list, 5);
  }

  /** Rolling average of 12 (most recent), WCA-trimmed. */
  get ao12(): number {
    return windowAverage(this.list, 12);
  }

  get count(): number {
    return this.list.length;
  }

  #save(): void {
    if (!browser) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ list: this.list }));
  }
}

export const solves = new SolvesStore();

import { browser } from '$app/environment';

/**
 * Optional Bluetooth smart-cube support — a progressive enhancement (VISION
 * §5.9). The app is fully usable without it; when a cube is connected we mirror
 * its live moves and can auto-time solves. cubing.js' bluetooth + puzzle code is
 * heavy and only needed once a user opts in, so it's **dynamically imported** on
 * connect (never statically) to keep it out of the main bundle.
 */

export type CubeStatus = 'unavailable' | 'idle' | 'connecting' | 'connected' | 'error';

/** A move reported by the cube: its notation and the cube's timestamp. */
export interface CubeMove {
  move: string;
  timeStamp: number;
}

type MoveSub = (m: CubeMove) => void;

class SmartCube {
  status = $state<CubeStatus>('unavailable');
  name = $state<string | null>(null);
  error = $state<string | null>(null);
  /** Moves seen since connecting — a cheap reactive activity signal. */
  moveCount = $state(0);
  lastMove = $state<string | null>(null);
  /** Best-effort: whether the cube is currently in the solved state. */
  solved = $state(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #puzzle: any = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #kpuzzle: any = null;
  #solvedKey = '';
  #subs = new Set<MoveSub>();

  constructor() {
    // Web Bluetooth needs a secure context and browser support.
    if (browser && typeof navigator !== 'undefined' && 'bluetooth' in navigator) {
      this.status = 'idle';
    }
  }

  /** Whether connecting is even possible in this browser. */
  get available(): boolean {
    return this.status !== 'unavailable';
  }

  /** Prompt the browser's device picker and connect. Must be a user gesture. */
  async connect(): Promise<void> {
    if (!this.available || this.status === 'connecting' || this.status === 'connected') return;
    this.status = 'connecting';
    this.error = null;
    try {
      const [{ connectSmartPuzzle }, { cube3x3x3 }] = await Promise.all([
        import('cubing/bluetooth'),
        import('cubing/puzzles')
      ]);
      this.#kpuzzle = await cube3x3x3.kpuzzle();
      this.#solvedKey = JSON.stringify(this.#kpuzzle.defaultPattern().patternData);

      const puzzle = await connectSmartPuzzle();
      this.#puzzle = puzzle;
      this.name = puzzle.name() ?? 'Smart cube';
      this.moveCount = 0;
      this.lastMove = null;
      this.status = 'connected';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      puzzle.addAlgLeafListener((e: any) => this.#onMove(e));
      this.#refreshSolved();
    } catch (err) {
      // A user cancelling the picker also lands here — treat as a non-error idle.
      const cancelled = err instanceof Error && /cancell?ed|user/i.test(err.message);
      this.status = cancelled ? 'idle' : 'error';
      this.error = cancelled ? null : err instanceof Error ? err.message : 'Connection failed.';
      this.#puzzle = null;
    }
  }

  disconnect(): void {
    try {
      this.#puzzle?.disconnect();
    } catch {
      // Ignore — we're tearing down anyway.
    }
    this.#puzzle = null;
    this.name = null;
    this.solved = false;
    this.status = this.available ? 'idle' : 'unavailable';
  }

  /** Subscribe to live moves; returns an unsubscribe function. */
  onMove(cb: MoveSub): () => void {
    this.#subs.add(cb);
    return () => this.#subs.delete(cb);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #onMove(e: any): void {
    const move = e?.latestAlgLeaf?.toString?.() ?? '';
    if (!move) return;
    this.moveCount++;
    this.lastMove = move;
    const payload: CubeMove = { move, timeStamp: e.timeStamp ?? performance.now() };
    for (const cb of this.#subs) cb(payload);
    this.#refreshSolved();
  }

  async #refreshSolved(): Promise<void> {
    if (!this.#puzzle) return;
    try {
      const pattern = await this.#puzzle.getPattern();
      this.solved = JSON.stringify(pattern.patternData) === this.#solvedKey;
    } catch {
      // Pattern read can briefly fail mid-stream — leave the last value.
    }
  }
}

export const smartCube = new SmartCube();

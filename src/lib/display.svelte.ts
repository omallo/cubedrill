import type { Phase, Visualization } from '$lib/domain';

/** Just the bits of a phase needed to resolve a visualization. */
type VizPhase = Pick<Phase, 'defaultVisualization' | 'supportedVisualizations'> | undefined;

/**
 * Shared, in-memory cube display preferences (visualization + hint facelets).
 * Both the Algorithms list and train views read this single instance, so a
 * toggle in one carries over when switching modes. Ephemeral for now — it
 * resets on reload; persist it later by mirroring to localStorage on change,
 * the same way `theme.svelte.ts` does.
 *
 * `viz` is the *preferred* visualization, or `null` to follow each phase's own
 * default. A phase that supports only one visualization always shows that one.
 */
class DisplayPrefs {
  /** Preferred visualization, or null to follow the phase default. */
  viz = $state<Visualization | null>(null);
  hintFacelets = $state(false);

  /** The visualization actually shown for a phase, honouring its support set. */
  resolveViz(phase: VizPhase): Visualization {
    const supported = phase?.supportedVisualizations ?? ['3D'];
    if (this.viz && supported.includes(this.viz)) return this.viz;
    return phase?.defaultVisualization ?? '3D';
  }

  /** Whether the phase supports flipping between 2D and 3D at all. */
  canToggleViz(phase: VizPhase): boolean {
    return (phase?.supportedVisualizations.length ?? 0) > 1;
  }

  /** Flip the effective visualization for a phase and remember the choice. */
  toggleViz(phase: VizPhase): void {
    this.viz = this.resolveViz(phase) === '2D' ? '3D' : '2D';
  }

  toggleHint(): void {
    this.hintFacelets = !this.hintFacelets;
  }
}

export const display = new DisplayPrefs();

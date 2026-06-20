/**
 * Public entry point for the domain model: the assembled catalog, its types,
 * and a small set of lookup helpers. UI code should read the catalog through
 * these helpers rather than indexing the raw arrays.
 */
export * from './types';
export { catalog } from './catalog';

import { catalog } from './catalog';
import type { AlgorithmSet, Case, Phase, SetGroup, SetMembership } from './types';

const phaseById = new Map(catalog.phases.map((p) => [p.id, p]));
const setById = new Map(catalog.sets.map((s) => [s.id, s]));
const caseById = new Map(catalog.cases.map((c) => [c.id, c]));

export function getPhase(id: string): Phase | undefined {
  return phaseById.get(id);
}

export function getSet(id: string): AlgorithmSet | undefined {
  return setById.get(id);
}

export function getCase(id: string): Case | undefined {
  return caseById.get(id);
}

/** Sets belonging to a phase, in learning-path order. */
export function setsForPhase(phaseId: string): AlgorithmSet[] {
  return catalog.sets.filter((s) => s.phaseId === phaseId).sort((a, b) => a.order - b.order);
}

/** A case resolved within the context of a set (set-relative label + group). */
export interface CaseInSet {
  case: Case;
  membership: SetMembership;
  group?: SetGroup;
  /** Set-relative label, falling back to the case's canonical name. */
  label: string;
}

/** All cases in a set, ordered by group order then in-group order. */
export function casesInSet(setId: string): CaseInSet[] {
  const set = setById.get(setId);
  if (!set) return [];
  const groupOrder = new Map(set.groups.map((g) => [g.id, g.order]));

  return catalog.memberships
    .filter((m) => m.setId === setId)
    .sort((a, b) => {
      const ga = a.groupId ? (groupOrder.get(a.groupId) ?? 0) : 0;
      const gb = b.groupId ? (groupOrder.get(b.groupId) ?? 0) : 0;
      return ga - gb || a.order - b.order;
    })
    .flatMap((m) => {
      const c = caseById.get(m.caseId);
      if (!c) return [];
      const group = m.groupId ? set.groups.find((g) => g.id === m.groupId) : undefined;
      return [{ case: c, membership: m, group, label: m.label ?? c.name }];
    });
}

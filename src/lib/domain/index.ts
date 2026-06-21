/**
 * Public entry point for the domain model: the assembled catalog, its types,
 * and a small set of lookup helpers. UI code should read the catalog through
 * these helpers rather than indexing the raw arrays.
 */
export * from './types';
export { catalog } from './catalog';

import { catalog } from './catalog';
import type {
  Algorithm,
  AlgorithmSet,
  Case,
  F2LSlot,
  Phase,
  SetGroup,
  SetMembership
} from './types';

/** F2L's canonical base slot — the default when a slot isn't specified. */
const DEFAULT_SLOT: F2LSlot = 'FR';

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

/**
 * The recommended algorithm for a case, resolving `primary` per slot.
 *
 * - OLL/PLL (no slots): returns the case's primary, else its first alg.
 * - F2L (sliced): with a `slot`, returns that slot's primary (else its first
 *   authored alg). Without a slot, falls back to the canonical `FR` slot. If the
 *   requested slot isn't authored yet (e.g. a missing BR, or not-yet-derived
 *   FL/BL), falls back to the case's overall primary so callers always get
 *   something renderable — check the returned `slot` if that matters.
 */
export function primaryAlgorithm(c: Case, slot?: F2LSlot): Algorithm | undefined {
  const algs = c.algorithms;
  if (algs.length === 0) return undefined;

  const sliced = algs.some((a) => a.slot);
  const wantSlot = slot ?? (sliced ? DEFAULT_SLOT : undefined);
  if (wantSlot) {
    const inSlot = algs.filter((a) => a.slot === wantSlot);
    if (inSlot.length) return inSlot.find((a) => a.primary) ?? inSlot[0];
    // Requested slot not authored — fall through to the overall default.
  }
  return algs.find((a) => a.primary) ?? algs[0];
}

/** Slots a case has an algorithm for (authored or mirror-derived), in canonical
 *  order (FR, FL, BR, BL). Empty for unsliced phases (OLL/PLL). */
const SLOT_ORDER: F2LSlot[] = ['FR', 'FL', 'BR', 'BL'];
export function slotsForCase(c: Case): F2LSlot[] {
  const present = new Set(c.algorithms.map((a) => a.slot).filter((s): s is F2LSlot => !!s));
  return SLOT_ORDER.filter((s) => present.has(s));
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

/** A contiguous run of cases sharing a group (group is undefined for ungrouped). */
export interface CaseGroup {
  group?: SetGroup;
  cases: CaseInSet[];
}

/**
 * Cases in a set partitioned into their groups, in learning-path order. Cases
 * without a group are collected into a trailing `group: undefined` section.
 */
export function caseGroupsInSet(setId: string): CaseGroup[] {
  const groups: CaseGroup[] = [];
  for (const item of casesInSet(setId)) {
    const last = groups[groups.length - 1];
    if (last && last.group?.id === item.group?.id) {
      last.cases.push(item);
    } else {
      groups.push({ group: item.group, cases: [item] });
    }
  }
  return groups;
}

/** All cases in a set, ordered by group order then in-group order. */
export function casesInSet(setId: string): CaseInSet[] {
  const set = setById.get(setId);
  if (!set) return [];
  const groupOrder = new Map(set.groups.map((g, i) => [g.id, i]));

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

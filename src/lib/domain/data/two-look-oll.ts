// 2-Look OLL — orient the last layer in two steps. The corner-orientation step
// is exactly the full OLL cases 21-27 (all edges oriented), reused via
// SetMembership; the edge-orientation step adds the few cases that exist only in
// the two-look world (corners ignored).
import type { AlgorithmSet, Case, SetMembership } from '../types';

export const twoLookOllSet: AlgorithmSet = {
  id: 'oll-2look',
  phaseId: 'oll',
  name: '2-Look OLL',
  description: 'Orient the last layer in two steps: edges, then corners. 10 cases.',
  tier: 'beginner',
  order: 0,
  groups: [
    { id: 'edges', name: 'Orient Edges' },
    { id: 'corners', name: 'Orient Corners' }
  ]
};

// Edge-orientation cases. These ignore the corners (which may be in any
// orientation when this step runs), so they don't correspond to a full OLL case.
export const twoLookOllCases: Case[] = [
  {
    id: 'oll-eo-line',
    phaseId: 'oll',
    name: 'Line',
    prob: 2,
    algorithms: [{ id: 'oll-eo-line/0', moves: "F R U R' U' F'", primary: true }]
  },
  {
    id: 'oll-eo-l',
    phaseId: 'oll',
    name: 'L-Shape',
    prob: 4,
    algorithms: [{ id: 'oll-eo-l/0', moves: "f R U R' U' f'", primary: true }]
  },
  {
    id: 'oll-eo-dot',
    phaseId: 'oll',
    name: 'Dot',
    prob: 1,
    algorithms: [
      {
        id: 'oll-eo-dot/0',
        moves: "F R U R' U' F' f R U R' U' f'",
        primary: true
      }
    ]
  }
];

export const twoLookOllMemberships: SetMembership[] = [
  // Step 1 — orient edges (new cases above).
  { setId: 'oll-2look', caseId: 'oll-eo-line', groupId: 'edges', order: 0 },
  { setId: 'oll-2look', caseId: 'oll-eo-l', groupId: 'edges', order: 1 },
  { setId: 'oll-2look', caseId: 'oll-eo-dot', groupId: 'edges', order: 2 },
  // Step 2 — orient corners. Exactly the "all edges oriented" OLL cases (21-27),
  // reused from the full set with their recognition names.
  { setId: 'oll-2look', caseId: 'oll-21', groupId: 'corners', order: 0, label: 'H' },
  { setId: 'oll-2look', caseId: 'oll-22', groupId: 'corners', order: 1, label: 'Pi' },
  { setId: 'oll-2look', caseId: 'oll-23', groupId: 'corners', order: 2, label: 'U' },
  { setId: 'oll-2look', caseId: 'oll-24', groupId: 'corners', order: 3, label: 'T' },
  { setId: 'oll-2look', caseId: 'oll-25', groupId: 'corners', order: 4, label: 'L' },
  { setId: 'oll-2look', caseId: 'oll-26', groupId: 'corners', order: 5, label: 'Antisune' },
  { setId: 'oll-2look', caseId: 'oll-27', groupId: 'corners', order: 6, label: 'Sune' }
];

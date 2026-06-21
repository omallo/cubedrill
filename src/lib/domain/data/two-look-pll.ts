// 2-Look PLL — the beginner-friendly two-step approach to permuting the last
// layer, sourced from jperm.net (/algs/2lookpll), one recommended algorithm per
// case. The edge-permutation step is exactly the full PLL Ua/Ub/H/Z cases,
// reused via SetMembership; the corner-permutation step adds the pure CPLL cases
// that exist only in the two-look world (edges ignored).
import type { AlgorithmSet, Case, SetMembership } from '../types';

export const twoLookPllSet: AlgorithmSet = {
  id: 'pll-2look',
  phaseId: 'pll',
  name: '2-Look PLL',
  description: 'Permute the last layer in two steps: corners, then edges. 6 cases.',
  tier: 'beginner',
  order: 0,
  groups: [
    { id: 'corners', name: 'Permute Corners', order: 0 },
    { id: 'edges', name: 'Permute Edges', order: 1 }
  ]
};

// Corner-permutation cases. These ignore the edges (permuted in step 2), so they
// don't correspond to a full PLL case.
export const twoLookPllCases: Case[] = [
  {
    id: 'pll-cp-adjacent',
    phaseId: 'pll',
    name: 'Headlights',
    prob: 4,
    algorithms: [
      {
        id: 'pll-cp-adjacent/0',
        moves: "R U R' U' R' F R2 U' R' U' R U R' F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'pll-cp-diagonal',
    phaseId: 'pll',
    name: 'Diagonal',
    prob: 1,
    algorithms: [
      {
        id: 'pll-cp-diagonal/0',
        moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
        primary: true,
        source: 'jperm'
      }
    ]
  }
];

export const twoLookPllMemberships: SetMembership[] = [
  // Step 1 — permute corners (new cases above).
  { setId: 'pll-2look', caseId: 'pll-cp-adjacent', groupId: 'corners', order: 0 },
  { setId: 'pll-2look', caseId: 'pll-cp-diagonal', groupId: 'corners', order: 1 },
  // Step 2 — permute edges. The edges-only PLL cases, reused from the full set.
  { setId: 'pll-2look', caseId: 'pll-h', groupId: 'edges', order: 0 },
  { setId: 'pll-2look', caseId: 'pll-z', groupId: 'edges', order: 1 },
  { setId: 'pll-2look', caseId: 'pll-ua', groupId: 'edges', order: 2 },
  { setId: 'pll-2look', caseId: 'pll-ub', groupId: 'edges', order: 3 }
];

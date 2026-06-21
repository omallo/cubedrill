// Full PLL — all 21 permutation-of-the-last-layer cases, one algorithm each.
import type { AlgorithmSet, Case, SetMembership } from '../types';

export const pllSet: AlgorithmSet = {
  id: 'pll-full',
  phaseId: 'pll',
  name: 'Full PLL',
  description: 'All 21 permutation-of-the-last-layer cases.',
  tier: 'full',
  order: 1,
  groups: [
    {
      id: 'edges-only',
      name: 'Edges Only'
    },
    {
      id: 'adjacent-corner-swap',
      name: 'Adjacent Corner Swap'
    },
    {
      id: 'diagonal-corner-swap',
      name: 'Diagonal Corner Swap'
    }
  ]
};

export const pllCases: Case[] = [
  {
    id: 'pll-h',
    phaseId: 'pll',
    name: 'H',
    prob: 1,
    algorithms: [
      {
        moves: "M2' U M2' U2 M2' U M2'",
        primary: true
      }
    ]
  },
  {
    id: 'pll-z',
    phaseId: 'pll',
    name: 'Z',
    prob: 2,
    algorithms: [
      {
        moves: "M' U M2' U M2' U M' U2 M2'",
        primary: true
      }
    ]
  },
  {
    id: 'pll-ua',
    phaseId: 'pll',
    name: 'Ua',
    prob: 4,
    algorithms: [
      {
        moves: "(R U' R U) (R U R U') R' U' R2",
        primary: true
      }
    ]
  },
  {
    id: 'pll-ub',
    phaseId: 'pll',
    name: 'Ub',
    prob: 4,
    algorithms: [
      {
        moves: "R2 U (R U R' U') (R' U' R' U) R'",
        primary: true
      }
    ]
  },
  {
    id: 'pll-aa',
    phaseId: 'pll',
    name: 'Aa',
    prob: 4,
    algorithms: [
      {
        moves: "x (R' U R') D2 (R U' R') D2 R2",
        primary: true
      }
    ]
  },
  {
    id: 'pll-ab',
    phaseId: 'pll',
    name: 'Ab',
    prob: 4,
    algorithms: [
      {
        moves: "x R2' D2 (R U R') D2 (R U' R)",
        primary: true
      }
    ]
  },
  {
    id: 'pll-e',
    phaseId: 'pll',
    name: 'E',
    prob: 2,
    algorithms: [
      {
        moves: "(R' U' R' D') (R U' R' D) (R U R' D') (R U R' D) R2",
        primary: true
      }
    ]
  },
  {
    id: 'pll-f',
    phaseId: 'pll',
    name: 'F',
    prob: 4,
    algorithms: [
      {
        moves: "R' U' F' (R U R' U') R' F (R2 U' R' U') (R U R' U) R",
        primary: true
      }
    ]
  },
  {
    id: 'pll-ja',
    phaseId: 'pll',
    name: 'Ja',
    prob: 4,
    algorithms: [
      {
        moves: "(L' U' L) F (L' U' L U) L F' (L2 U L)",
        primary: true
      }
    ]
  },
  {
    id: 'pll-jb',
    phaseId: 'pll',
    name: 'Jb',
    prob: 4,
    algorithms: [
      {
        moves: "(R U R') F' (R U R' U') R' F (R2 U' R')",
        primary: true
      }
    ]
  },
  {
    id: 'pll-ra',
    phaseId: 'pll',
    name: 'Ra',
    prob: 4,
    algorithms: [
      {
        moves: "(R U' R' U') (R U R) D (R' U' R) D' (R' U2 R')",
        primary: true
      }
    ]
  },
  {
    id: 'pll-rb',
    phaseId: 'pll',
    name: 'Rb',
    prob: 4,
    algorithms: [
      {
        moves: "(R' U2 R') D' (R U' R') D (R U R U') (R' U' R)",
        primary: true
      }
    ]
  },
  {
    id: 'pll-t',
    phaseId: 'pll',
    name: 'T',
    prob: 4,
    algorithms: [
      {
        moves: "(R U R' U') R' F (R2 U' R' U') (R U R') F'",
        primary: true
      }
    ]
  },
  {
    id: 'pll-y',
    phaseId: 'pll',
    name: 'Y',
    prob: 4,
    algorithms: [
      {
        moves: "F (R U' R' U') (R U R') F' (R U R' U') (R' F R F')",
        primary: true
      }
    ]
  },
  {
    id: 'pll-v',
    phaseId: 'pll',
    name: 'V',
    prob: 4,
    algorithms: [
      {
        moves: "R' (U R' U' R) D' R' D R' (U D') R2 U' R2' D R2",
        primary: true
      }
    ]
  },
  {
    id: 'pll-na',
    phaseId: 'pll',
    name: 'Na',
    prob: 1,
    algorithms: [
      {
        moves: "(R U R' U) (R U R') F' (R U R' U') R' F (R2 U' R' U2) (R U' R')",
        primary: true
      }
    ]
  },
  {
    id: 'pll-nb',
    phaseId: 'pll',
    name: 'Nb',
    prob: 1,
    algorithms: [
      {
        moves: "(L' U' L U') (L' U' L) F (L' U' L U) L F' (L2' U L U2') (L' U L)",
        primary: true
      }
    ]
  },
  {
    id: 'pll-ga',
    phaseId: 'pll',
    name: 'Ga',
    prob: 4,
    algorithms: [
      {
        moves: "(R2 U R' U) (R' U' R U') R2 (U' D) (R' U R) D'",
        primary: true
      }
    ]
  },
  {
    id: 'pll-gb',
    phaseId: 'pll',
    name: 'Gb',
    prob: 4,
    algorithms: [
      {
        moves: "(R' U' R) (U D') R2 U (R' U R U' R) U' R2' D",
        primary: true
      }
    ]
  },
  {
    id: 'pll-gc',
    phaseId: 'pll',
    name: 'Gc',
    prob: 4,
    algorithms: [
      {
        moves: "R2' U' R U' (R U R') U R2 (U D') (R U' R') D",
        primary: true
      }
    ]
  },
  {
    id: 'pll-gd',
    phaseId: 'pll',
    name: 'Gd',
    prob: 4,
    algorithms: [
      {
        moves: "(R U R') (U' D) R2 U' (R U' R' U) R' U R2 D'",
        primary: true
      }
    ]
  }
];

export const pllMemberships: SetMembership[] = [
  {
    setId: 'pll-full',
    caseId: 'pll-h',
    groupId: 'edges-only',
    order: 0
  },
  {
    setId: 'pll-full',
    caseId: 'pll-z',
    groupId: 'edges-only',
    order: 1
  },
  {
    setId: 'pll-full',
    caseId: 'pll-ua',
    groupId: 'edges-only',
    order: 2
  },
  {
    setId: 'pll-full',
    caseId: 'pll-ub',
    groupId: 'edges-only',
    order: 3
  },
  {
    setId: 'pll-full',
    caseId: 'pll-aa',
    groupId: 'adjacent-corner-swap',
    order: 0
  },
  {
    setId: 'pll-full',
    caseId: 'pll-ab',
    groupId: 'adjacent-corner-swap',
    order: 1
  },
  {
    setId: 'pll-full',
    caseId: 'pll-e',
    groupId: 'diagonal-corner-swap',
    order: 0
  },
  {
    setId: 'pll-full',
    caseId: 'pll-f',
    groupId: 'adjacent-corner-swap',
    order: 2
  },
  {
    setId: 'pll-full',
    caseId: 'pll-ja',
    groupId: 'adjacent-corner-swap',
    order: 3
  },
  {
    setId: 'pll-full',
    caseId: 'pll-jb',
    groupId: 'adjacent-corner-swap',
    order: 4
  },
  {
    setId: 'pll-full',
    caseId: 'pll-ra',
    groupId: 'adjacent-corner-swap',
    order: 5
  },
  {
    setId: 'pll-full',
    caseId: 'pll-rb',
    groupId: 'adjacent-corner-swap',
    order: 6
  },
  {
    setId: 'pll-full',
    caseId: 'pll-t',
    groupId: 'adjacent-corner-swap',
    order: 7
  },
  {
    setId: 'pll-full',
    caseId: 'pll-y',
    groupId: 'diagonal-corner-swap',
    order: 1
  },
  {
    setId: 'pll-full',
    caseId: 'pll-v',
    groupId: 'diagonal-corner-swap',
    order: 2
  },
  {
    setId: 'pll-full',
    caseId: 'pll-na',
    groupId: 'diagonal-corner-swap',
    order: 3
  },
  {
    setId: 'pll-full',
    caseId: 'pll-nb',
    groupId: 'diagonal-corner-swap',
    order: 4
  },
  {
    setId: 'pll-full',
    caseId: 'pll-ga',
    groupId: 'adjacent-corner-swap',
    order: 8
  },
  {
    setId: 'pll-full',
    caseId: 'pll-gb',
    groupId: 'adjacent-corner-swap',
    order: 9
  },
  {
    setId: 'pll-full',
    caseId: 'pll-gc',
    groupId: 'adjacent-corner-swap',
    order: 10
  },
  {
    setId: 'pll-full',
    caseId: 'pll-gd',
    groupId: 'adjacent-corner-swap',
    order: 11
  }
];

// AUTO-GENERATED from jperm.net PLL data (/lib/pll.js): 21 cases, jperm's
// recommended algorithm first (primary) followed by his alternatives. Curate freely.
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
      name: 'Edges Only',
      order: 0
    },
    {
      id: 'adjacent-corner-swap',
      name: 'Adjacent Corner Swap',
      order: 1
    },
    {
      id: 'diagonal-corner-swap',
      name: 'Diagonal Corner Swap',
      order: 2
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
        id: 'pll-h/0',
        moves: 'M2 U M2 U2 M2 U M2',
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-h/1',
        moves: "M2 U' M2 U2 M2 U' M2",
        source: 'jperm'
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
        id: 'pll-z/0',
        moves: "M' U M2 U M2 U M' U2 M2",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-z/1',
        moves: "y M' U' M2 U' M2 U' M' U2 M2",
        source: 'jperm'
      },
      {
        id: 'pll-z/2',
        moves: "y M2 U M2 U M' U2 M2 U2 M'",
        source: 'jperm'
      },
      {
        id: 'pll-z/3',
        moves: "M2 U' M2 U' M' U2 M2 U2 M'",
        source: 'jperm'
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
        id: 'pll-ua/0',
        moves: "M2 U M U2 M' U M2",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-ua/1',
        moves: "R U' R U R U R U' R' U' R2",
        source: 'jperm'
      },
      {
        id: 'pll-ua/2',
        moves: "y2 R2 U' R' U' R U R U R U' R",
        source: 'jperm'
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
        id: 'pll-ub/0',
        moves: "M2 U' M U2 M' U' M2",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-ub/1',
        moves: "R2 U (R U R' U') R' U' R' U R'",
        source: 'jperm'
      },
      {
        id: 'pll-ub/2',
        moves: "y2 R' U R' U' R' U' (R' U R U) R2",
        source: 'jperm'
      },
      {
        id: 'pll-ub/3',
        moves: "y2 R' U R' U' R3 U' (R' U R U) R2",
        source: 'jperm'
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
        id: 'pll-aa/0',
        moves: "x L2 D2 L' U' L D2 L' U L'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-aa/1',
        moves: "y' x' L' U L' D2 L U' L' D2 L2",
        source: 'jperm'
      },
      {
        id: 'pll-aa/2',
        moves: "y x R' U R' D2 R U' R' D2 R2",
        source: 'jperm'
      },
      {
        id: 'pll-aa/3',
        moves: "y2 x' R2 D2 R' U' R D2 R' U R'",
        source: 'jperm'
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
        id: 'pll-ab/0',
        moves: "x' L2 D2 L U L' D2 L U' L",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-ab/1',
        moves: "y x L U' L D2 L' U L D2 L2",
        source: 'jperm'
      },
      {
        id: 'pll-ab/2',
        moves: "y2 x R2 D2 R U R' D2 R U' R",
        source: 'jperm'
      },
      {
        id: 'pll-ab/3',
        moves: "y' x' R U' R D2 R' U R D2 R2",
        source: 'jperm'
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
        id: 'pll-e/0',
        moves: "x' L' U L D' L' U' L D L' U' L D' L' U L D",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-e/1',
        moves: "x' R U' R' D R U R' D' R U R' D R U' R' D'",
        source: 'jperm'
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
        id: 'pll-f/0',
        moves: "R' U' F' R U R' U' R' F R2 U' R' U' R U R' U R",
        primary: true,
        source: 'jperm'
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
        id: 'pll-ja/0',
        moves: "x R2 F R F' R U2 r' U r U2",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-ja/1',
        moves: "y2 L' U' L F L' U' L U L F' L2 U L",
        source: 'jperm'
      },
      {
        id: 'pll-ja/2',
        moves: "y' R' U L' U2 R U' R' U2 R L",
        source: 'jperm'
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
        id: 'pll-jb/0',
        moves: "R U R' F' R U R' U' R' F R2 U' R'",
        primary: true,
        source: 'jperm'
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
        id: 'pll-ra/0',
        moves: "R U' R' U' R U R D R' U' R D' R' U2 R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-ra/1',
        moves: "R U R' F' R U2 R' U2 R' F R U R U2 R'",
        source: 'jperm'
      },
      {
        id: 'pll-ra/2',
        moves: "y' L U2 L' U2 L F' L' U' L U L F L2",
        source: 'jperm'
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
        id: 'pll-rb/0',
        moves: "R2 F R U R U' R' F' R U2 R' U2 R",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-rb/1',
        moves: "y' R' U2 R U2 R' F R U R' U' R' F' R2",
        source: 'jperm'
      },
      {
        id: 'pll-rb/2',
        moves: "R' U2 R' D' R U' R' D R U R U' R' U' R",
        source: 'jperm'
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
        id: 'pll-t/0',
        moves: "R U R' U' R' F R2 U' R' U' (R U R') F'",
        primary: true,
        source: 'jperm'
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
        id: 'pll-y/0',
        moves: "F R U' R' U' R U R' F' R U R' U' R' F R F'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-y/1',
        moves: "F R' F R2 U' R' U' R U R' F' R U R' U' F'",
        source: 'jperm'
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
        id: 'pll-v/0',
        moves: "R' U R' U' y R' F' R2 U' R' U R' F R F",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-v/1',
        moves: "R' U R' U' R D' R' D R' U D' R2 U' R2 D R2",
        source: 'jperm'
      },
      {
        id: 'pll-v/2',
        moves: "z D' R2 D R2 U R' D' R U' R U R' D R U' z'",
        source: 'jperm'
      },
      {
        id: 'pll-v/3',
        moves: "R U2 R' D R U' R U' R U R2 D R' U' R D2",
        source: 'jperm'
      },
      {
        id: 'pll-v/4',
        moves: "x' R' F R F' U R U2 R' U' R U' R' U2 R U R' U'",
        source: 'jperm'
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
        id: 'pll-na/0',
        moves: "R U R' U R U R' F' R U R' U' R' F R2 U' R' U2 R U' R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-na/1',
        moves: "z U R' D R2 U' R D' U R' D R2 U' R D'",
        source: 'jperm'
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
        id: 'pll-nb/0',
        moves: "R' (U R U' R') F' U' F R U R' F R' F' R U' R",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-nb/1',
        moves: "z D' R U' R2 D R' U D' R U' R2 D R' U",
        source: 'jperm'
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
        id: 'pll-ga/0',
        moves: "R2 U R' U R' U' R U' R2 (U' D) R' U R D'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-ga/1',
        moves: "R2 u R' U R' U' R u' R2 y' R' U R",
        source: 'jperm'
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
        id: 'pll-gb/0',
        moves: "R' U' R (U D') R2 U R' U R U' R U' R2 D",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-gb/1',
        moves: "y F' U' F R2 u R' U R U' R u' R2",
        source: 'jperm'
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
        id: 'pll-gc/0',
        moves: "R2 U' R U' R U R' U R2 (U D') R U' R' D",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-gc/1',
        moves: "y2 R2 F2 R U2 R U2 R' F R U R' U' R' F R2",
        source: 'jperm'
      },
      {
        id: 'pll-gc/2',
        moves: "R2 u' R U' R U R' u R2 y R U' R'",
        source: 'jperm'
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
        id: 'pll-gd/0',
        moves: "R U R' (U' D) R2 U' R U' R' U R' U R2 D'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'pll-gd/1',
        moves: "R U R' y' R2 u' R U' R' U R' u R2",
        source: 'jperm'
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

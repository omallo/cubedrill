// AUTO-GENERATED from jperm.net OLL data (/lib/oll.js): 57 cases, jperm's
// recommended algorithm first (primary) followed by his alternatives. Curate freely.
import type { AlgorithmSet, Case, SetMembership } from '../types';

export const ollSet: AlgorithmSet = {
  id: 'oll-full',
  phaseId: 'oll',
  name: 'Full OLL',
  description: 'All 57 orientation-of-the-last-layer cases.',
  tier: 'full',
  order: 1,
  groups: [
    {
      id: 'dot',
      name: 'Dot',
      order: 0
    },
    {
      id: 'square-shape',
      name: 'Square Shape',
      order: 1
    },
    {
      id: 'small-lightning-bolt',
      name: 'Small Lightning Bolt',
      order: 2
    },
    {
      id: 'fish-shape',
      name: 'Fish Shape',
      order: 3
    },
    {
      id: 'knight-move-shape',
      name: 'Knight Move Shape',
      order: 4
    },
    {
      id: 'cross',
      name: 'Cross',
      order: 5
    },
    {
      id: 'corners-oriented',
      name: 'Corners Oriented',
      order: 6
    },
    {
      id: 'awkward-shape',
      name: 'Awkward Shape',
      order: 7
    },
    {
      id: 'p-shape',
      name: 'P Shape',
      order: 8
    },
    {
      id: 't-shape',
      name: 'T Shape',
      order: 9
    },
    {
      id: 'c-shape',
      name: 'C Shape',
      order: 10
    },
    {
      id: 'w-shape',
      name: 'W Shape',
      order: 11
    },
    {
      id: 'big-lightning-bolt',
      name: 'Big Lightning Bolt',
      order: 12
    },
    {
      id: 'small-l-shape',
      name: 'Small L Shape',
      order: 13
    },
    {
      id: 'i-shape',
      name: 'I Shape',
      order: 14
    }
  ]
};

export const ollCases: Case[] = [
  {
    id: 'oll-1',
    phaseId: 'oll',
    name: 'OLL 1',
    number: 1,
    prob: 2,
    algorithms: [
      {
        id: 'oll-1/0',
        moves: "R U2 R' R' F R F' U2 R' F R F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-2',
    phaseId: 'oll',
    name: 'OLL 2',
    number: 2,
    prob: 4,
    algorithms: [
      {
        id: 'oll-2/0',
        moves: "r U r' U2 r U2 R' U2 R U' r'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-2/1',
        moves: "y' F R U R' U' F' f R U R' U' f'",
        source: 'jperm'
      },
      {
        id: 'oll-2/2',
        moves: "y' F R U R' U' S R U R' U' f'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-3',
    phaseId: 'oll',
    name: 'OLL 3',
    number: 3,
    prob: 4,
    algorithms: [
      {
        id: 'oll-3/0',
        moves: "r' R2 U R' U r U2 r' U M'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-3/1',
        moves: "y F U R U' R' F' U F R U R' U' F'",
        source: 'jperm'
      },
      {
        id: 'oll-3/2',
        moves: "y' f R U R' U' f' U' F R U R' U' F'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-4',
    phaseId: 'oll',
    name: 'OLL 4',
    number: 4,
    prob: 4,
    algorithms: [
      {
        id: 'oll-4/0',
        moves: "M U' r U2 r' U' R U' R' M'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-4/1',
        moves: "y F U R U' R' F' U' F R U R' U' F'",
        source: 'jperm'
      },
      {
        id: 'oll-4/2',
        moves: "y' f R U R' U' f' U F R U R' U' F'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-5',
    phaseId: 'oll',
    name: 'OLL 5',
    number: 5,
    prob: 4,
    algorithms: [
      {
        id: 'oll-5/0',
        moves: "l' U2 L U L' U l",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-5/1',
        moves: "y2 r' U2 R U R' U r",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-6',
    phaseId: 'oll',
    name: 'OLL 6',
    number: 6,
    prob: 4,
    algorithms: [
      {
        id: 'oll-6/0',
        moves: "r U2 R' U' R U' r'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-7',
    phaseId: 'oll',
    name: 'OLL 7',
    number: 7,
    prob: 4,
    algorithms: [
      {
        id: 'oll-7/0',
        moves: "r U R' U R U2 r'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-8',
    phaseId: 'oll',
    name: 'OLL 8',
    number: 8,
    prob: 4,
    algorithms: [
      {
        id: 'oll-8/0',
        moves: "l' U' L U' L' U2 l",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-8/1',
        moves: "R U2 R' U2 R' F R F'",
        source: 'jperm'
      },
      {
        id: 'oll-8/2',
        moves: "y2 r' U' R U' R' U2 r",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-9',
    phaseId: 'oll',
    name: 'OLL 9',
    number: 9,
    prob: 4,
    algorithms: [
      {
        id: 'oll-9/0',
        moves: "R U R' U' R' F R2 U R' U' F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-10',
    phaseId: 'oll',
    name: 'OLL 10',
    number: 10,
    prob: 4,
    algorithms: [
      {
        id: 'oll-10/0',
        moves: "R U R' U R' F R F' R U2 R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-10/1',
        moves: "y2 r U R' U R U' R' U' r' R (U R U' R')",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-11',
    phaseId: 'oll',
    name: 'OLL 11',
    number: 11,
    prob: 4,
    algorithms: [
      {
        id: 'oll-11/0',
        moves: "r U R' U R' F R F' R U2 r'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-11/1',
        moves: "y2 r' R2 U R' U R U2 R' U M'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-12',
    phaseId: 'oll',
    name: 'OLL 12',
    number: 12,
    prob: 4,
    algorithms: [
      {
        id: 'oll-12/0',
        moves: "M' R' U' R U' R' U2 R U' R r'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-13',
    phaseId: 'oll',
    name: 'OLL 13',
    number: 13,
    prob: 4,
    algorithms: [
      {
        id: 'oll-13/0',
        moves: "F U R U' R2 F' R U R U' R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-13/1',
        moves: "r U' r' U' r U r' y' R' U R",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-14',
    phaseId: 'oll',
    name: 'OLL 14',
    number: 14,
    prob: 4,
    algorithms: [
      {
        id: 'oll-14/0',
        moves: "R' F R U R' F' R F U' F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-15',
    phaseId: 'oll',
    name: 'OLL 15',
    number: 15,
    prob: 4,
    algorithms: [
      {
        id: 'oll-15/0',
        moves: "l' U' l L' U' L U l' U l",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-15/1',
        moves: "y2 r' U' r R' U' R U r' U r",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-16',
    phaseId: 'oll',
    name: 'OLL 16',
    number: 16,
    prob: 4,
    algorithms: [
      {
        id: 'oll-16/0',
        moves: "r U r' R U R' U' r U' r'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-17',
    phaseId: 'oll',
    name: 'OLL 17',
    number: 17,
    prob: 4,
    algorithms: [
      {
        id: 'oll-17/0',
        moves: "F R' F' R2 r' U R U' R' U' M'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-17/1',
        moves: "y2 R U R' U R' F R F' U2 R' F R F'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-18',
    phaseId: 'oll',
    name: 'OLL 18',
    number: 18,
    prob: 4,
    algorithms: [
      {
        id: 'oll-18/0',
        moves: "r U R' U R U2 r' r' U' R U' R' U2 r",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-18/1',
        moves: "y R U2 R' R' F R F' U2 M' (U R U' r')",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-19',
    phaseId: 'oll',
    name: 'OLL 19',
    number: 19,
    prob: 4,
    algorithms: [
      {
        id: 'oll-19/0',
        moves: "r' R U R U R' U' M' R' F R F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-20',
    phaseId: 'oll',
    name: 'OLL 20',
    number: 20,
    prob: 1,
    algorithms: [
      {
        id: 'oll-20/0',
        moves: "r U R' U' M2 U R U' R' U' M'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-20/1',
        moves: "r' R U (R U R' U') M2 U R U' r'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-21',
    phaseId: 'oll',
    name: 'OLL 21',
    number: 21,
    prob: 2,
    algorithms: [
      {
        id: 'oll-21/0',
        moves: "R U2 R' U' R U R' U' R U' R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-21/1',
        moves: "y R U R' U R U' R' U R U2 R'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-22',
    phaseId: 'oll',
    name: 'OLL 22',
    number: 22,
    prob: 4,
    algorithms: [
      {
        id: 'oll-22/0',
        moves: "R U2 (R2 U' R2 U' R2) U2 R",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-23',
    phaseId: 'oll',
    name: 'OLL 23',
    number: 23,
    prob: 4,
    algorithms: [
      {
        id: 'oll-23/0',
        moves: "R2 D' R U2 R' D R U2 R",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-23/1',
        moves: "y2 R2 D R' U2 R D' R' U2 R'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-24',
    phaseId: 'oll',
    name: 'OLL 24',
    number: 24,
    prob: 4,
    algorithms: [
      {
        id: 'oll-24/0',
        moves: "r U R' U' r' F R F'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-24/1',
        moves: "y R U R D R' U' R D' R2",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-25',
    phaseId: 'oll',
    name: 'OLL 25',
    number: 25,
    prob: 4,
    algorithms: [
      {
        id: 'oll-25/0',
        moves: "F' r U R' U' r' F R",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-25/1',
        moves: "y' R' F R B' R' F' R B",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-26',
    phaseId: 'oll',
    name: 'OLL 26',
    number: 26,
    prob: 4,
    algorithms: [
      {
        id: 'oll-26/0',
        moves: "(R U2 R') U' R U' R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-26/1',
        moves: "y' R' U' R U' R' U2 R",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-27',
    phaseId: 'oll',
    name: 'OLL 27',
    number: 27,
    prob: 4,
    algorithms: [
      {
        id: 'oll-27/0',
        moves: "R U R' U R U2 R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-27/1',
        moves: "y' R' U2 (R U R' U) R",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-28',
    phaseId: 'oll',
    name: 'OLL 28',
    number: 28,
    prob: 4,
    algorithms: [
      {
        id: 'oll-28/0',
        moves: "r U R' U' r' R U R U' R'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-29',
    phaseId: 'oll',
    name: 'OLL 29',
    number: 29,
    prob: 4,
    algorithms: [
      {
        id: 'oll-29/0',
        moves: "R U R' U' R U' R' F' U' F R U R'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-30',
    phaseId: 'oll',
    name: 'OLL 30',
    number: 30,
    prob: 4,
    algorithms: [
      {
        id: 'oll-30/0',
        moves: "F R' F R2 U' R' U' R U R' F2",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-30/1',
        moves: "F U (R U2 R' U') R U2 R' U' F'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-31',
    phaseId: 'oll',
    name: 'OLL 31',
    number: 31,
    prob: 4,
    algorithms: [
      {
        id: 'oll-31/0',
        moves: "R' U' F U R U' R' F' R",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-32',
    phaseId: 'oll',
    name: 'OLL 32',
    number: 32,
    prob: 4,
    algorithms: [
      {
        id: 'oll-32/0',
        moves: "L U F' U' L' U L F L'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-32/1',
        moves: "y2 S R U R' U' R' F R f'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-33',
    phaseId: 'oll',
    name: 'OLL 33',
    number: 33,
    prob: 4,
    algorithms: [
      {
        id: 'oll-33/0',
        moves: "R U R' U' R' F R F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-34',
    phaseId: 'oll',
    name: 'OLL 34',
    number: 34,
    prob: 4,
    algorithms: [
      {
        id: 'oll-34/0',
        moves: "R U R2 U' R' F R U R U' F'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-34/1',
        moves: "R U R' U' B' R' F R F' B",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-35',
    phaseId: 'oll',
    name: 'OLL 35',
    number: 35,
    prob: 4,
    algorithms: [
      {
        id: 'oll-35/0',
        moves: "R U2 R' R' F R F' R U2 R'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-36',
    phaseId: 'oll',
    name: 'OLL 36',
    number: 36,
    prob: 4,
    algorithms: [
      {
        id: 'oll-36/0',
        moves: "L' U' L U' L' U L U L F' L' F",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-36/1',
        moves: "y2 R' U' R U' R' U R U R B' R' B",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-37',
    phaseId: 'oll',
    name: 'OLL 37',
    number: 37,
    prob: 4,
    algorithms: [
      {
        id: 'oll-37/0',
        moves: "F R' F' R U R U' R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-37/1',
        moves: "F R U' R' U' R U R' F'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-38',
    phaseId: 'oll',
    name: 'OLL 38',
    number: 38,
    prob: 4,
    algorithms: [
      {
        id: 'oll-38/0',
        moves: "R U R' U R U' R' U' R' F R F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-39',
    phaseId: 'oll',
    name: 'OLL 39',
    number: 39,
    prob: 4,
    algorithms: [
      {
        id: 'oll-39/0',
        moves: "L F' L' U' L U F U' L'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-39/1',
        moves: "y2 R B' R' U' R U B U' R'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-40',
    phaseId: 'oll',
    name: 'OLL 40',
    number: 40,
    prob: 4,
    algorithms: [
      {
        id: 'oll-40/0',
        moves: "R' F R U R' U' F' U R",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-41',
    phaseId: 'oll',
    name: 'OLL 41',
    number: 41,
    prob: 4,
    algorithms: [
      {
        id: 'oll-41/0',
        moves: "R U R' U R U2 R' F R U R' U' F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-42',
    phaseId: 'oll',
    name: 'OLL 42',
    number: 42,
    prob: 4,
    algorithms: [
      {
        id: 'oll-42/0',
        moves: "R' U' R U' R' U2 R F R U R' U' F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-43',
    phaseId: 'oll',
    name: 'OLL 43',
    number: 43,
    prob: 4,
    algorithms: [
      {
        id: 'oll-43/0',
        moves: "F' U' L' U L F",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-43/1',
        moves: "R' U' F R' F' R U R",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-44',
    phaseId: 'oll',
    name: 'OLL 44',
    number: 44,
    prob: 4,
    algorithms: [
      {
        id: 'oll-44/0',
        moves: "F U R U' R' F'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-44/1',
        moves: "y2 f R U R' U' f'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-45',
    phaseId: 'oll',
    name: 'OLL 45',
    number: 45,
    prob: 4,
    algorithms: [
      {
        id: 'oll-45/0',
        moves: "F R U R' U' F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-46',
    phaseId: 'oll',
    name: 'OLL 46',
    number: 46,
    prob: 4,
    algorithms: [
      {
        id: 'oll-46/0',
        moves: "R' U' R' F R F' U R",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-47',
    phaseId: 'oll',
    name: 'OLL 47',
    number: 47,
    prob: 4,
    algorithms: [
      {
        id: 'oll-47/0',
        moves: "R' U' R' F R F' R' F R F' U R",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-47/1',
        moves: "F' L' U' L U L' U' L U F",
        source: 'jperm'
      },
      {
        id: 'oll-47/2',
        moves: "y' F U R U' R' F' R U R' U R U2 R'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-48',
    phaseId: 'oll',
    name: 'OLL 48',
    number: 48,
    prob: 4,
    algorithms: [
      {
        id: 'oll-48/0',
        moves: "F R U R' U' R U R' U' F'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-49',
    phaseId: 'oll',
    name: 'OLL 49',
    number: 49,
    prob: 4,
    algorithms: [
      {
        id: 'oll-49/0',
        moves: "r U' r2 U r2 U r2 U' r",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-50',
    phaseId: 'oll',
    name: 'OLL 50',
    number: 50,
    prob: 4,
    algorithms: [
      {
        id: 'oll-50/0',
        moves: "r' U r2 U' r2 U' r2 U r'",
        primary: true,
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-51',
    phaseId: 'oll',
    name: 'OLL 51',
    number: 51,
    prob: 4,
    algorithms: [
      {
        id: 'oll-51/0',
        moves: "F U R U' R' U R U' R' F'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-51/1',
        moves: "y2 f R U R' U' R U R' U' f'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-52',
    phaseId: 'oll',
    name: 'OLL 52',
    number: 52,
    prob: 4,
    algorithms: [
      {
        id: 'oll-52/0',
        moves: "R U R' U R U' B U' B' R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-52/1',
        moves: "y2 R' F' U' F U' (R U R' U) R",
        source: 'jperm'
      },
      {
        id: 'oll-52/2',
        moves: "R U R' U R U' y R U' R' F'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-53',
    phaseId: 'oll',
    name: 'OLL 53',
    number: 53,
    prob: 4,
    algorithms: [
      {
        id: 'oll-53/0',
        moves: "l' U2 L U L' U' L U L' U l",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-53/1',
        moves: "y2 r' U2 (R U R' U') R U R' U r",
        source: 'jperm'
      },
      {
        id: 'oll-53/2',
        moves: "y r' U' R U' R' U R U' R' U2 r",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-54',
    phaseId: 'oll',
    name: 'OLL 54',
    number: 54,
    prob: 4,
    algorithms: [
      {
        id: 'oll-54/0',
        moves: "(r U2 R' U') R U R' U' R U' r'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-54/1',
        moves: "y r U R' U R U' R' U R U2 r'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-55',
    phaseId: 'oll',
    name: 'OLL 55',
    number: 55,
    prob: 2,
    algorithms: [
      {
        id: 'oll-55/0',
        moves: "R' F R U R U' R2 F' R2 U' R' U R U R'",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-55/1',
        moves: "y R U2 R2 U' R U' R' U2 F R F'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-56',
    phaseId: 'oll',
    name: 'OLL 56',
    number: 56,
    prob: 2,
    algorithms: [
      {
        id: 'oll-56/0',
        moves: "(r' U' r) U' R' U R U' R' U R r' U r",
        primary: true,
        source: 'jperm'
      },
      {
        id: 'oll-56/1',
        moves: "(r U r') U R U' R' U R U' R' (r U' r')",
        source: 'jperm'
      },
      {
        id: 'oll-56/2',
        moves: "(r U r') U R U' R' U R U' M' U' r'",
        source: 'jperm'
      }
    ]
  },
  {
    id: 'oll-57',
    phaseId: 'oll',
    name: 'OLL 57',
    number: 57,
    prob: 2,
    algorithms: [
      {
        id: 'oll-57/0',
        moves: "R U R' U' M' U R U' r'",
        primary: true,
        source: 'jperm'
      }
    ]
  }
];

export const ollMemberships: SetMembership[] = [
  {
    setId: 'oll-full',
    caseId: 'oll-1',
    groupId: 'dot',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-2',
    groupId: 'dot',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-3',
    groupId: 'dot',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-4',
    groupId: 'dot',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-5',
    groupId: 'square-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-6',
    groupId: 'square-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-7',
    groupId: 'small-lightning-bolt',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-8',
    groupId: 'small-lightning-bolt',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-9',
    groupId: 'fish-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-10',
    groupId: 'fish-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-11',
    groupId: 'small-lightning-bolt',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-12',
    groupId: 'small-lightning-bolt',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-13',
    groupId: 'knight-move-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-14',
    groupId: 'knight-move-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-15',
    groupId: 'knight-move-shape',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-16',
    groupId: 'knight-move-shape',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-17',
    groupId: 'dot',
    order: 4
  },
  {
    setId: 'oll-full',
    caseId: 'oll-18',
    groupId: 'dot',
    order: 5
  },
  {
    setId: 'oll-full',
    caseId: 'oll-19',
    groupId: 'dot',
    order: 6
  },
  {
    setId: 'oll-full',
    caseId: 'oll-20',
    groupId: 'dot',
    order: 7
  },
  {
    setId: 'oll-full',
    caseId: 'oll-21',
    groupId: 'cross',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-22',
    groupId: 'cross',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-23',
    groupId: 'cross',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-24',
    groupId: 'cross',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-25',
    groupId: 'cross',
    order: 4
  },
  {
    setId: 'oll-full',
    caseId: 'oll-26',
    groupId: 'cross',
    order: 5
  },
  {
    setId: 'oll-full',
    caseId: 'oll-27',
    groupId: 'cross',
    order: 6
  },
  {
    setId: 'oll-full',
    caseId: 'oll-28',
    groupId: 'corners-oriented',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-29',
    groupId: 'awkward-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-30',
    groupId: 'awkward-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-31',
    groupId: 'p-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-32',
    groupId: 'p-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-33',
    groupId: 't-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-34',
    groupId: 'c-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-35',
    groupId: 'fish-shape',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-36',
    groupId: 'w-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-37',
    groupId: 'fish-shape',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-38',
    groupId: 'w-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-39',
    groupId: 'big-lightning-bolt',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-40',
    groupId: 'big-lightning-bolt',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-41',
    groupId: 'awkward-shape',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-42',
    groupId: 'awkward-shape',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-43',
    groupId: 'p-shape',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-44',
    groupId: 'p-shape',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-45',
    groupId: 't-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-46',
    groupId: 'c-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-47',
    groupId: 'small-l-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-48',
    groupId: 'small-l-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-49',
    groupId: 'small-l-shape',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-50',
    groupId: 'small-l-shape',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-51',
    groupId: 'i-shape',
    order: 0
  },
  {
    setId: 'oll-full',
    caseId: 'oll-52',
    groupId: 'i-shape',
    order: 1
  },
  {
    setId: 'oll-full',
    caseId: 'oll-53',
    groupId: 'small-l-shape',
    order: 4
  },
  {
    setId: 'oll-full',
    caseId: 'oll-54',
    groupId: 'small-l-shape',
    order: 5
  },
  {
    setId: 'oll-full',
    caseId: 'oll-55',
    groupId: 'i-shape',
    order: 2
  },
  {
    setId: 'oll-full',
    caseId: 'oll-56',
    groupId: 'i-shape',
    order: 3
  },
  {
    setId: 'oll-full',
    caseId: 'oll-57',
    groupId: 'corners-oriented',
    order: 1
  }
];

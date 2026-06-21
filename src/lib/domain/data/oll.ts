// Full OLL — all 57 orientation-of-the-last-layer cases, the recommended
// algorithm first (primary) followed by alternatives.
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
      name: 'Dot'
    },
    {
      id: 'square-shape',
      name: 'Square Shape'
    },
    {
      id: 'small-lightning-bolt',
      name: 'Small Lightning Bolt'
    },
    {
      id: 'fish-shape',
      name: 'Fish Shape'
    },
    {
      id: 'knight-move-shape',
      name: 'Knight Move Shape'
    },
    {
      id: 'cross',
      name: 'Cross'
    },
    {
      id: 'corners-oriented',
      name: 'Corners Oriented'
    },
    {
      id: 'awkward-shape',
      name: 'Awkward Shape'
    },
    {
      id: 'p-shape',
      name: 'P Shape'
    },
    {
      id: 't-shape',
      name: 'T Shape'
    },
    {
      id: 'c-shape',
      name: 'C Shape'
    },
    {
      id: 'w-shape',
      name: 'W Shape'
    },
    {
      id: 'big-lightning-bolt',
      name: 'Big Lightning Bolt'
    },
    {
      id: 'small-l-shape',
      name: 'Small L Shape'
    },
    {
      id: 'i-shape',
      name: 'I Shape'
    }
  ]
};

export const ollCases: Case[] = [
  {
    id: 'oll-1',
    phaseId: 'oll',
    name: 'OLL 1',
    prob: 2,
    algorithms: [
      {
        moves: "R U2 R' R' F R F' U2 R' F R F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-2',
    phaseId: 'oll',
    name: 'OLL 2',
    prob: 4,
    algorithms: [
      {
        moves: "r U r' U2 r U2 R' U2 R U' r'",
        primary: true
      },
      {
        moves: "y' F R U R' U' F' f R U R' U' f'"
      },
      {
        moves: "y' F R U R' U' S R U R' U' f'"
      }
    ]
  },
  {
    id: 'oll-3',
    phaseId: 'oll',
    name: 'OLL 3',
    prob: 4,
    algorithms: [
      {
        moves: "r' R2 U R' U r U2 r' U M'",
        primary: true
      },
      {
        moves: "y F U R U' R' F' U F R U R' U' F'"
      },
      {
        moves: "y' f R U R' U' f' U' F R U R' U' F'"
      }
    ]
  },
  {
    id: 'oll-4',
    phaseId: 'oll',
    name: 'OLL 4',
    prob: 4,
    algorithms: [
      {
        moves: "M U' r U2 r' U' R U' R' M'",
        primary: true
      },
      {
        moves: "y F U R U' R' F' U' F R U R' U' F'"
      },
      {
        moves: "y' f R U R' U' f' U F R U R' U' F'"
      }
    ]
  },
  {
    id: 'oll-5',
    phaseId: 'oll',
    name: 'OLL 5',
    prob: 4,
    algorithms: [
      {
        moves: "l' U2 L U L' U l",
        primary: true
      },
      {
        moves: "y2 r' U2 R U R' U r"
      }
    ]
  },
  {
    id: 'oll-6',
    phaseId: 'oll',
    name: 'OLL 6',
    prob: 4,
    algorithms: [
      {
        moves: "r U2 R' U' R U' r'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-7',
    phaseId: 'oll',
    name: 'OLL 7',
    prob: 4,
    algorithms: [
      {
        moves: "r U R' U R U2 r'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-8',
    phaseId: 'oll',
    name: 'OLL 8',
    prob: 4,
    algorithms: [
      {
        moves: "l' U' L U' L' U2 l",
        primary: true
      },
      {
        moves: "R U2 R' U2 R' F R F'"
      },
      {
        moves: "y2 r' U' R U' R' U2 r"
      }
    ]
  },
  {
    id: 'oll-9',
    phaseId: 'oll',
    name: 'OLL 9',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U' R' F R2 U R' U' F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-10',
    phaseId: 'oll',
    name: 'OLL 10',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U R' F R F' R U2 R'",
        primary: true
      },
      {
        moves: "y2 r U R' U R U' R' U' r' R (U R U' R')"
      }
    ]
  },
  {
    id: 'oll-11',
    phaseId: 'oll',
    name: 'OLL 11',
    prob: 4,
    algorithms: [
      {
        moves: "r U R' U R' F R F' R U2 r'",
        primary: true
      },
      {
        moves: "y2 r' R2 U R' U R U2 R' U M'"
      }
    ]
  },
  {
    id: 'oll-12',
    phaseId: 'oll',
    name: 'OLL 12',
    prob: 4,
    algorithms: [
      {
        moves: "M' R' U' R U' R' U2 R U' R r'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-13',
    phaseId: 'oll',
    name: 'OLL 13',
    prob: 4,
    algorithms: [
      {
        moves: "F U R U' R2 F' R U R U' R'",
        primary: true
      },
      {
        moves: "r U' r' U' r U r' y' R' U R"
      }
    ]
  },
  {
    id: 'oll-14',
    phaseId: 'oll',
    name: 'OLL 14',
    prob: 4,
    algorithms: [
      {
        moves: "R' F R U R' F' R F U' F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-15',
    phaseId: 'oll',
    name: 'OLL 15',
    prob: 4,
    algorithms: [
      {
        moves: "l' U' l L' U' L U l' U l",
        primary: true
      },
      {
        moves: "y2 r' U' r R' U' R U r' U r"
      }
    ]
  },
  {
    id: 'oll-16',
    phaseId: 'oll',
    name: 'OLL 16',
    prob: 4,
    algorithms: [
      {
        moves: "r U r' R U R' U' r U' r'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-17',
    phaseId: 'oll',
    name: 'OLL 17',
    prob: 4,
    algorithms: [
      {
        moves: "F R' F' R2 r' U R U' R' U' M'",
        primary: true
      },
      {
        moves: "y2 R U R' U R' F R F' U2 R' F R F'"
      }
    ]
  },
  {
    id: 'oll-18',
    phaseId: 'oll',
    name: 'OLL 18',
    prob: 4,
    algorithms: [
      {
        moves: "r U R' U R U2 r' r' U' R U' R' U2 r",
        primary: true
      },
      {
        moves: "y R U2 R' R' F R F' U2 M' (U R U' r')"
      }
    ]
  },
  {
    id: 'oll-19',
    phaseId: 'oll',
    name: 'OLL 19',
    prob: 4,
    algorithms: [
      {
        moves: "r' R U R U R' U' M' R' F R F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-20',
    phaseId: 'oll',
    name: 'OLL 20',
    prob: 1,
    algorithms: [
      {
        moves: "r U R' U' M2 U R U' R' U' M'",
        primary: true
      },
      {
        moves: "r' R U (R U R' U') M2 U R U' r'"
      }
    ]
  },
  {
    id: 'oll-21',
    phaseId: 'oll',
    name: 'OLL 21',
    prob: 2,
    algorithms: [
      {
        moves: "R U2 R' U' R U R' U' R U' R'",
        primary: true
      },
      {
        moves: "y R U R' U R U' R' U R U2 R'"
      }
    ]
  },
  {
    id: 'oll-22',
    phaseId: 'oll',
    name: 'OLL 22',
    prob: 4,
    algorithms: [
      {
        moves: "R U2 (R2 U' R2 U' R2) U2 R",
        primary: true
      }
    ]
  },
  {
    id: 'oll-23',
    phaseId: 'oll',
    name: 'OLL 23',
    prob: 4,
    algorithms: [
      {
        moves: "R2 D' R U2 R' D R U2 R",
        primary: true
      },
      {
        moves: "y2 R2 D R' U2 R D' R' U2 R'"
      }
    ]
  },
  {
    id: 'oll-24',
    phaseId: 'oll',
    name: 'OLL 24',
    prob: 4,
    algorithms: [
      {
        moves: "r U R' U' r' F R F'",
        primary: true
      },
      {
        moves: "y R U R D R' U' R D' R2"
      }
    ]
  },
  {
    id: 'oll-25',
    phaseId: 'oll',
    name: 'OLL 25',
    prob: 4,
    algorithms: [
      {
        moves: "F' r U R' U' r' F R",
        primary: true
      },
      {
        moves: "y' R' F R B' R' F' R B"
      }
    ]
  },
  {
    id: 'oll-26',
    phaseId: 'oll',
    name: 'OLL 26',
    prob: 4,
    algorithms: [
      {
        moves: "(R U2 R') U' R U' R'",
        primary: true
      },
      {
        moves: "y' R' U' R U' R' U2 R"
      }
    ]
  },
  {
    id: 'oll-27',
    phaseId: 'oll',
    name: 'OLL 27',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U R U2 R'",
        primary: true
      },
      {
        moves: "y' R' U2 (R U R' U) R"
      }
    ]
  },
  {
    id: 'oll-28',
    phaseId: 'oll',
    name: 'OLL 28',
    prob: 4,
    algorithms: [
      {
        moves: "r U R' U' r' R U R U' R'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-29',
    phaseId: 'oll',
    name: 'OLL 29',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U' R U' R' F' U' F R U R'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-30',
    phaseId: 'oll',
    name: 'OLL 30',
    prob: 4,
    algorithms: [
      {
        moves: "F R' F R2 U' R' U' R U R' F2",
        primary: true
      },
      {
        moves: "F U (R U2 R' U') R U2 R' U' F'"
      }
    ]
  },
  {
    id: 'oll-31',
    phaseId: 'oll',
    name: 'OLL 31',
    prob: 4,
    algorithms: [
      {
        moves: "R' U' F U R U' R' F' R",
        primary: true
      }
    ]
  },
  {
    id: 'oll-32',
    phaseId: 'oll',
    name: 'OLL 32',
    prob: 4,
    algorithms: [
      {
        moves: "L U F' U' L' U L F L'",
        primary: true
      },
      {
        moves: "y2 S R U R' U' R' F R f'"
      }
    ]
  },
  {
    id: 'oll-33',
    phaseId: 'oll',
    name: 'OLL 33',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U' R' F R F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-34',
    phaseId: 'oll',
    name: 'OLL 34',
    prob: 4,
    algorithms: [
      {
        moves: "R U R2 U' R' F R U R U' F'",
        primary: true
      },
      {
        moves: "R U R' U' B' R' F R F' B"
      }
    ]
  },
  {
    id: 'oll-35',
    phaseId: 'oll',
    name: 'OLL 35',
    prob: 4,
    algorithms: [
      {
        moves: "R U2 R' R' F R F' R U2 R'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-36',
    phaseId: 'oll',
    name: 'OLL 36',
    prob: 4,
    algorithms: [
      {
        moves: "L' U' L U' L' U L U L F' L' F",
        primary: true
      },
      {
        moves: "y2 R' U' R U' R' U R U R B' R' B"
      }
    ]
  },
  {
    id: 'oll-37',
    phaseId: 'oll',
    name: 'OLL 37',
    prob: 4,
    algorithms: [
      {
        moves: "F R' F' R U R U' R'",
        primary: true
      },
      {
        moves: "F R U' R' U' R U R' F'"
      }
    ]
  },
  {
    id: 'oll-38',
    phaseId: 'oll',
    name: 'OLL 38',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U R U' R' U' R' F R F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-39',
    phaseId: 'oll',
    name: 'OLL 39',
    prob: 4,
    algorithms: [
      {
        moves: "L F' L' U' L U F U' L'",
        primary: true
      },
      {
        moves: "y2 R B' R' U' R U B U' R'"
      }
    ]
  },
  {
    id: 'oll-40',
    phaseId: 'oll',
    name: 'OLL 40',
    prob: 4,
    algorithms: [
      {
        moves: "R' F R U R' U' F' U R",
        primary: true
      }
    ]
  },
  {
    id: 'oll-41',
    phaseId: 'oll',
    name: 'OLL 41',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U R U2 R' F R U R' U' F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-42',
    phaseId: 'oll',
    name: 'OLL 42',
    prob: 4,
    algorithms: [
      {
        moves: "R' U' R U' R' U2 R F R U R' U' F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-43',
    phaseId: 'oll',
    name: 'OLL 43',
    prob: 4,
    algorithms: [
      {
        moves: "F' U' L' U L F",
        primary: true
      },
      {
        moves: "R' U' F R' F' R U R"
      }
    ]
  },
  {
    id: 'oll-44',
    phaseId: 'oll',
    name: 'OLL 44',
    prob: 4,
    algorithms: [
      {
        moves: "F U R U' R' F'",
        primary: true
      },
      {
        moves: "y2 f R U R' U' f'"
      }
    ]
  },
  {
    id: 'oll-45',
    phaseId: 'oll',
    name: 'OLL 45',
    prob: 4,
    algorithms: [
      {
        moves: "F R U R' U' F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-46',
    phaseId: 'oll',
    name: 'OLL 46',
    prob: 4,
    algorithms: [
      {
        moves: "R' U' R' F R F' U R",
        primary: true
      }
    ]
  },
  {
    id: 'oll-47',
    phaseId: 'oll',
    name: 'OLL 47',
    prob: 4,
    algorithms: [
      {
        moves: "R' U' R' F R F' R' F R F' U R",
        primary: true
      },
      {
        moves: "F' L' U' L U L' U' L U F"
      },
      {
        moves: "y' F U R U' R' F' R U R' U R U2 R'"
      }
    ]
  },
  {
    id: 'oll-48',
    phaseId: 'oll',
    name: 'OLL 48',
    prob: 4,
    algorithms: [
      {
        moves: "F R U R' U' R U R' U' F'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-49',
    phaseId: 'oll',
    name: 'OLL 49',
    prob: 4,
    algorithms: [
      {
        moves: "r U' r2 U r2 U r2 U' r",
        primary: true
      }
    ]
  },
  {
    id: 'oll-50',
    phaseId: 'oll',
    name: 'OLL 50',
    prob: 4,
    algorithms: [
      {
        moves: "r' U r2 U' r2 U' r2 U r'",
        primary: true
      }
    ]
  },
  {
    id: 'oll-51',
    phaseId: 'oll',
    name: 'OLL 51',
    prob: 4,
    algorithms: [
      {
        moves: "F U R U' R' U R U' R' F'",
        primary: true
      },
      {
        moves: "y2 f R U R' U' R U R' U' f'"
      }
    ]
  },
  {
    id: 'oll-52',
    phaseId: 'oll',
    name: 'OLL 52',
    prob: 4,
    algorithms: [
      {
        moves: "R U R' U R U' B U' B' R'",
        primary: true
      },
      {
        moves: "y2 R' F' U' F U' (R U R' U) R"
      },
      {
        moves: "R U R' U R U' y R U' R' F'"
      }
    ]
  },
  {
    id: 'oll-53',
    phaseId: 'oll',
    name: 'OLL 53',
    prob: 4,
    algorithms: [
      {
        moves: "l' U2 L U L' U' L U L' U l",
        primary: true
      },
      {
        moves: "y2 r' U2 (R U R' U') R U R' U r"
      },
      {
        moves: "y r' U' R U' R' U R U' R' U2 r"
      }
    ]
  },
  {
    id: 'oll-54',
    phaseId: 'oll',
    name: 'OLL 54',
    prob: 4,
    algorithms: [
      {
        moves: "(r U2 R' U') R U R' U' R U' r'",
        primary: true
      },
      {
        moves: "y r U R' U R U' R' U R U2 r'"
      }
    ]
  },
  {
    id: 'oll-55',
    phaseId: 'oll',
    name: 'OLL 55',
    prob: 2,
    algorithms: [
      {
        moves: "R' F R U R U' R2 F' R2 U' R' U R U R'",
        primary: true
      },
      {
        moves: "y R U2 R2 U' R U' R' U2 F R F'"
      }
    ]
  },
  {
    id: 'oll-56',
    phaseId: 'oll',
    name: 'OLL 56',
    prob: 2,
    algorithms: [
      {
        moves: "(r' U' r) U' R' U R U' R' U R r' U r",
        primary: true
      },
      {
        moves: "(r U r') U R U' R' U R U' R' (r U' r')"
      },
      {
        moves: "(r U r') U R U' R' U R U' M' U' r'"
      }
    ]
  },
  {
    id: 'oll-57',
    phaseId: 'oll',
    name: 'OLL 57',
    prob: 2,
    algorithms: [
      {
        moves: "R U R' U' M' U R U' r'",
        primary: true
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

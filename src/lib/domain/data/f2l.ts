// Standard F2L (41 cases). FR is complete and primary; BR is authored where
// available (30/41) — FL is derived from FR and BL from BR at render time (not
// stored). Ids follow speedcubedb numbering.
import type { AlgorithmSet, Case, SetMembership } from '../types';

export const f2lStandardSet: AlgorithmSet = {
  id: 'f2l-standard',
  phaseId: 'f2l',
  name: 'Standard F2L',
  description: 'The 41 basic first-two-layers cases.',
  tier: 'standard',
  order: 0,
  groups: [
    {
      id: 'cross-sticker-faces-up',
      name: 'Cross Sticker Faces Up'
    },
    {
      id: 'cross-sticker-faces-side-front-different',
      name: 'Cross Sticker Faces Side/Front - different'
    },
    {
      id: 'cross-sticker-faces-side-front-same',
      name: 'Cross Sticker Faces Side/Front - same'
    },
    {
      id: 'edge-in-the-slot',
      name: 'Edge in the slot'
    },
    {
      id: 'corner-in-the-slot',
      name: 'Corner in the slot'
    },
    {
      id: 'both-pieces-in-the-slot',
      name: 'Both pieces in the slot'
    }
  ]
};

export const f2lStandardCases: Case[] = [
  {
    id: 'f2l-21',
    phaseId: 'f2l',
    name: 'F2L 21',
    algorithms: [
      {
        id: 'f2l-21/fr',
        moves: "U2' (R U R') U (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-21/br',
        moves: "y U2' (R U R') U (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-22',
    phaseId: 'f2l',
    name: 'F2L 22',
    algorithms: [
      {
        id: 'f2l-22/fr',
        moves: "y U2 (L' U' L) U' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-22/br',
        moves: "U2' (R' U' R) U' (R' U R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-19',
    phaseId: 'f2l',
    name: 'F2L 19',
    algorithms: [
      {
        id: 'f2l-19/fr',
        moves: "U (R U2' R') U (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-19/br',
        moves: "y U (R U2' R') U (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-20',
    phaseId: 'f2l',
    name: 'F2L 20',
    algorithms: [
      {
        id: 'f2l-20/fr',
        moves: "y U' (L' U2 L) U' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-20/br',
        moves: "U' (R' U2' R) U' (R' U R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-23',
    phaseId: 'f2l',
    name: 'F2L 23',
    algorithms: [
      {
        id: 'f2l-23/fr',
        moves: "U (R U' R') U' (R U' R') U (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-23/br',
        moves: "y U (R U' R') U' (R U' R') U (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-24',
    phaseId: 'f2l',
    name: 'F2L 24',
    algorithms: [
      {
        id: 'f2l-24/fr',
        moves: "y U' (L' U L) U (L' U L) U' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-24/br',
        moves: "U (R U R' U R U2' R2') U R",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-17',
    phaseId: 'f2l',
    name: 'F2L 17',
    algorithms: [
      {
        id: 'f2l-17/fr',
        moves: "(R U2' R') U' (R U R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-17/br',
        moves: "y (R U2' R') U' (R U R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-18',
    phaseId: 'f2l',
    name: 'F2L 18',
    algorithms: [
      {
        id: 'f2l-18/fr',
        moves: "y (L' U2 L) U (L' U' L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-18/br',
        moves: "(R' U2' R) U (R' U' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-4',
    phaseId: 'f2l',
    name: 'F2L 4',
    algorithms: [
      {
        id: 'f2l-4/fr',
        moves: "(R U R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-4/br',
        moves: "y (R U R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-3',
    phaseId: 'f2l',
    name: 'F2L 3',
    algorithms: [
      {
        id: 'f2l-3/fr',
        moves: "y (L' U' L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-3/br',
        moves: "(R' U' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-10',
    phaseId: 'f2l',
    name: 'F2L 10',
    algorithms: [
      {
        id: 'f2l-10/fr',
        moves: "U' (R U R') U (R U R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-10/br',
        moves: "y U' (R U R') U (R U R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-9',
    phaseId: 'f2l',
    name: 'F2L 9',
    algorithms: [
      {
        id: 'f2l-9/fr',
        moves: "y U (L' U' L) U' (L' U' L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-9/br',
        moves: "U (R' U' R) U' (R' U' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-12',
    phaseId: 'f2l',
    name: 'F2L 12',
    algorithms: [
      {
        id: 'f2l-12/fr',
        moves: "(R U' R') U (R U' R') U2 (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-12/br',
        moves: "y (R U' R') U (R U' R') U2 (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-11',
    phaseId: 'f2l',
    name: 'F2L 11',
    algorithms: [
      {
        id: 'f2l-11/fr',
        moves: "y (L' U L) U' (L' U L) U2' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-11/br',
        moves: "R U2' R2' U' R2 U' R'",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-14',
    phaseId: 'f2l',
    name: 'F2L 14',
    algorithms: [
      {
        id: 'f2l-14/fr',
        moves: "U' (R U' R') U (R U R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-14/br',
        moves: "y U' (R U' R') U (R U R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-13',
    phaseId: 'f2l',
    name: 'F2L 13',
    algorithms: [
      {
        id: 'f2l-13/fr',
        moves: "y U (L' U L) U' (L' U' L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-13/br',
        moves: "U (R' U R) U' (R' U' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-2',
    phaseId: 'f2l',
    name: 'F2L 2',
    algorithms: [
      {
        id: 'f2l-2/fr',
        moves: "y U' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-2/br',
        moves: "U' (R' U R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-1',
    phaseId: 'f2l',
    name: 'F2L 1',
    algorithms: [
      {
        id: 'f2l-1/fr',
        moves: "U (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-1/br',
        moves: "y U (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-8',
    phaseId: 'f2l',
    name: 'F2L 8',
    algorithms: [
      {
        id: 'f2l-8/fr',
        moves: "y U (L' U2 L) U2' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-8/br',
        moves: "U (R' U2' R) U (R' U2' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-7',
    phaseId: 'f2l',
    name: 'F2L 7',
    algorithms: [
      {
        id: 'f2l-7/fr',
        moves: "U' (R U2' R') U2 (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-7/br',
        moves: "y U' (R U2' R') U2 (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-5',
    phaseId: 'f2l',
    name: 'F2L 5',
    algorithms: [
      {
        id: 'f2l-5/fr',
        moves: "U' (R U R') U2 (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-5/br',
        moves: "y U' (R U R') U2 (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-6',
    phaseId: 'f2l',
    name: 'F2L 6',
    algorithms: [
      {
        id: 'f2l-6/fr',
        moves: "y U (L' U' L) U2' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-6/br',
        moves: "U (R' U' R) U (R' U2' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-15',
    phaseId: 'f2l',
    name: 'F2L 15',
    algorithms: [
      {
        id: 'f2l-15/fr',
        moves: "(R U R') U2 (R U' R') U (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-15/br',
        moves: "y (R U R') U2 (R U' R') U (R U' R')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-16',
    phaseId: 'f2l',
    name: 'F2L 16',
    algorithms: [
      {
        id: 'f2l-16/fr',
        moves: "y (L' U' L) U2' (L' U L) U' (L' U L)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-16/br',
        moves: "(R' U' R) U2' (R' U R) U' (R' U R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-34',
    phaseId: 'f2l',
    name: 'F2L 34',
    algorithms: [
      {
        id: 'f2l-34/fr',
        moves: "U (R U R') U2 (R U R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-34/br',
        moves: "U (R' U R) U (R' U2' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-33',
    phaseId: 'f2l',
    name: 'F2L 33',
    algorithms: [
      {
        id: 'f2l-33/fr',
        moves: "U' (R U' R') U2 (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-33/br',
        moves: "U' (R' U' R) U2' (R' U' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-36',
    phaseId: 'f2l',
    name: 'F2L 36',
    algorithms: [
      {
        id: 'f2l-36/fr',
        moves: "U (F' U' F) U' (R U R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-36/br',
        moves: "U (R' U' R) U' (f R f')",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-35',
    phaseId: 'f2l',
    name: 'F2L 35',
    algorithms: [
      {
        id: 'f2l-35/fr',
        moves: "U' (R U R') U (F' U' F)",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-35/br',
        moves: "U' (f R f') U (R' U' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-32',
    phaseId: 'f2l',
    name: 'F2L 32',
    algorithms: [
      {
        id: 'f2l-32/fr',
        moves: "(U R U' R') (U R U' R') (U R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-32/br',
        moves: "(U' R' U R) (U' R' U R) (U' R' U R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-31',
    phaseId: 'f2l',
    name: 'F2L 31',
    algorithms: [
      {
        id: 'f2l-31/fr',
        moves: "U' (R' F R F') (R U' R')",
        slot: 'FR',
        primary: true
      },
      {
        id: 'f2l-31/br',
        moves: "(f R' f') (R' U2' R)",
        slot: 'BR'
      }
    ]
  },
  {
    id: 'f2l-30',
    phaseId: 'f2l',
    name: 'F2L 30',
    algorithms: [
      {
        id: 'f2l-30/fr',
        moves: "(R U R') U' (R U R')",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-29',
    phaseId: 'f2l',
    name: 'F2L 29',
    algorithms: [
      {
        id: 'f2l-29/fr',
        moves: "y (L' U' L) U (L' U' L)",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-27',
    phaseId: 'f2l',
    name: 'F2L 27',
    algorithms: [
      {
        id: 'f2l-27/fr',
        moves: "(R U' R') U (R U' R') ",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-28',
    phaseId: 'f2l',
    name: 'F2L 28',
    algorithms: [
      {
        id: 'f2l-28/fr',
        moves: "y (L' U L) U' (L' U L)",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-25',
    phaseId: 'f2l',
    name: 'F2L 25',
    algorithms: [
      {
        id: 'f2l-25/fr',
        moves: "U' (R' F R F') (R U R')",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-26',
    phaseId: 'f2l',
    name: 'F2L 26',
    algorithms: [
      {
        id: 'f2l-26/fr',
        moves: "y U (L F' L' F) (L' U' L)",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-39',
    phaseId: 'f2l',
    name: 'F2L 39',
    algorithms: [
      {
        id: 'f2l-39/fr',
        moves: "(R U' R') U (R U2' R') U (R U' R')",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-38',
    phaseId: 'f2l',
    name: 'F2L 38',
    algorithms: [
      {
        id: 'f2l-38/fr',
        moves: "(R U' R') U' (R U R') U2 (R U' R')",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-41',
    phaseId: 'f2l',
    name: 'F2L 41',
    algorithms: [
      {
        id: 'f2l-41/fr',
        moves: "(R U' R') y U2 (L' U' L) U' (L' U L)",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-40',
    phaseId: 'f2l',
    name: 'F2L 40',
    algorithms: [
      {
        id: 'f2l-40/fr',
        moves: "(R U' R') y U (L' U' L) U' (L' U' L)",
        slot: 'FR',
        primary: true
      }
    ]
  },
  {
    id: 'f2l-37',
    phaseId: 'f2l',
    name: 'F2L 37',
    algorithms: [
      {
        id: 'f2l-37/fr',
        moves: "(R U' R') y U (L' U2 L) U2' (L' U L)",
        slot: 'FR',
        primary: true
      }
    ]
  }
];

export const f2lStandardMemberships: SetMembership[] = [
  {
    setId: 'f2l-standard',
    caseId: 'f2l-21',
    groupId: 'cross-sticker-faces-up',
    order: 0
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-22',
    groupId: 'cross-sticker-faces-up',
    order: 1
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-19',
    groupId: 'cross-sticker-faces-up',
    order: 2
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-20',
    groupId: 'cross-sticker-faces-up',
    order: 3
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-23',
    groupId: 'cross-sticker-faces-up',
    order: 4
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-24',
    groupId: 'cross-sticker-faces-up',
    order: 5
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-17',
    groupId: 'cross-sticker-faces-up',
    order: 6
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-18',
    groupId: 'cross-sticker-faces-up',
    order: 7
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-4',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 0
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-3',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 1
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-10',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 2
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-9',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 3
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-12',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 4
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-11',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 5
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-14',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 6
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-13',
    groupId: 'cross-sticker-faces-side-front-different',
    order: 7
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-2',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 0
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-1',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 1
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-8',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 2
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-7',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 3
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-5',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 4
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-6',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 5
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-15',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 6
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-16',
    groupId: 'cross-sticker-faces-side-front-same',
    order: 7
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-34',
    groupId: 'edge-in-the-slot',
    order: 0
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-33',
    groupId: 'edge-in-the-slot',
    order: 1
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-36',
    groupId: 'edge-in-the-slot',
    order: 2
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-35',
    groupId: 'edge-in-the-slot',
    order: 3
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-32',
    groupId: 'edge-in-the-slot',
    order: 4
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-31',
    groupId: 'edge-in-the-slot',
    order: 5
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-30',
    groupId: 'corner-in-the-slot',
    order: 0
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-29',
    groupId: 'corner-in-the-slot',
    order: 1
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-27',
    groupId: 'corner-in-the-slot',
    order: 2
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-28',
    groupId: 'corner-in-the-slot',
    order: 3
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-25',
    groupId: 'corner-in-the-slot',
    order: 4
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-26',
    groupId: 'corner-in-the-slot',
    order: 5
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-39',
    groupId: 'both-pieces-in-the-slot',
    order: 0
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-38',
    groupId: 'both-pieces-in-the-slot',
    order: 1
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-41',
    groupId: 'both-pieces-in-the-slot',
    order: 2
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-40',
    groupId: 'both-pieces-in-the-slot',
    order: 3
  },
  {
    setId: 'f2l-standard',
    caseId: 'f2l-37',
    groupId: 'both-pieces-in-the-slot',
    order: 4
  }
];

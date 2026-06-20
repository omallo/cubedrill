import type { Catalog, Method, Phase, Tag } from './types';
import { f2lStandardSet, f2lStandardCases, f2lStandardMemberships } from './data/f2l';
import { ollSet, ollCases, ollMemberships } from './data/oll';
import { pllSet, pllCases, pllMemberships } from './data/pll';

/**
 * The CFOP method and its phases. CFOP is the only method for now; the model
 * supports more, but the UI assumes CFOP until a second method exists.
 */
const cfop: Method = {
  id: 'cfop',
  name: 'CFOP',
  fullName: 'Cross, F2L, OLL, PLL (Fridrich)',
  description:
    'The most common advanced 3x3 method: solve the cross, then the first two layers, then orient and permute the last layer.',
  phaseIds: ['cross', 'f2l', 'oll', 'pll']
};

const phases: Phase[] = [
  {
    id: 'cross',
    methodId: 'cfop',
    name: 'Cross',
    description:
      'Solve the four bottom-layer edges. Intuitive rather than algorithmic, but with learnable patterns and planning techniques.',
    nature: 'conceptual',
    order: 0,
    mask: 'cross',
    defaultVisualization: '3D',
    supportedVisualizations: ['3D']
  },
  {
    id: 'f2l',
    methodId: 'cfop',
    name: 'F2L',
    fullName: 'First Two Layers',
    description:
      'Pair a corner with its edge and insert into a slot, completing the first two layers.',
    nature: 'algorithmic',
    order: 1,
    mask: 'f2l',
    defaultVisualization: '3D',
    supportedVisualizations: ['3D']
  },
  {
    id: 'oll',
    methodId: 'cfop',
    name: 'OLL',
    fullName: 'Orientation of the Last Layer',
    description: 'Orient all last-layer pieces so the top face is one color.',
    nature: 'algorithmic',
    order: 2,
    mask: 'oll',
    defaultVisualization: '2D',
    supportedVisualizations: ['2D', '3D']
  },
  {
    id: 'pll',
    methodId: 'cfop',
    name: 'PLL',
    fullName: 'Permutation of the Last Layer',
    description: 'Permute the last-layer pieces into place, solving the cube.',
    nature: 'algorithmic',
    order: 3,
    mask: 'pll',
    defaultVisualization: '2D',
    supportedVisualizations: ['2D', '3D']
  }
];

// Tags will grow as OLL/F2L are seeded (shape, recognition group, ergonomics, ...).
const tags: Tag[] = [];

export const catalog: Catalog = {
  methods: [cfop],
  phases,
  sets: [f2lStandardSet, ollSet, pllSet],
  cases: [...f2lStandardCases, ...ollCases, ...pllCases],
  memberships: [...f2lStandardMemberships, ...ollMemberships, ...pllMemberships],
  tags
};

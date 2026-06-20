import type { ComponentType } from 'svelte';
import {
  LayoutDashboard,
  Library,
  Dumbbell,
  Wand2,
  Timer,
  BarChart3,
  Settings
} from 'lucide-svelte';

export interface NavItem {
  label: string;
  href: string;
  icon: ComponentType;
  /** Short description used for tooltips / placeholder views. */
  description?: string;
}

export interface NavSection {
  /** Optional group heading shown above the items. */
  title?: string;
  items: NavItem[];
}

/**
 * Primary sidebar navigation. This is the single source of truth for the app's
 * top-level structure — the sidebar renders from it and placeholder views read
 * descriptions from it. Add new sections/items here as views come online.
 */
export const primaryNav: NavSection[] = [
  {
    items: [
      {
        label: 'Dashboard',
        href: '/',
        icon: LayoutDashboard,
        description: 'Your learning overview at a glance.'
      }
    ]
  },
  {
    title: 'Practice',
    items: [
      {
        label: 'Library',
        href: '/library',
        icon: Library,
        description: 'Browse algorithm sets and curate your personal set.'
      },
      {
        label: 'Train',
        href: '/train',
        icon: Dumbbell,
        description: 'Drill algorithms with recognition and timing.'
      },
      {
        label: 'Solver',
        href: '/solver',
        icon: Wand2,
        description: 'Generate human-style solutions from your personal set.'
      },
      {
        label: 'Solves',
        href: '/solves',
        icon: Timer,
        description: 'Practice full and partial solves with time tracking.'
      }
    ]
  },
  {
    title: 'Track',
    items: [
      {
        label: 'Progress',
        href: '/progress',
        icon: BarChart3,
        description: 'Goals, sessions, stats, and feedback over time.'
      }
    ]
  }
];

/** Navigation pinned to the bottom of the sidebar. */
export const footerNav: NavItem[] = [
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'App preferences and account.'
  }
];

/** Flattened list of every nav item, useful for lookups (e.g. page titles). */
export const allNavItems: NavItem[] = [...primaryNav.flatMap((s) => s.items), ...footerNav];

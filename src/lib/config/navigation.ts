import {
  LayoutDashboard,
  GraduationCap,
  Blocks,
  WandSparkles,
  Timer,
  ChartColumn,
  Settings
} from 'lucide-svelte';
import type { IconComponent } from '$lib/types';

export interface NavItem {
  label: string;
  href: string;
  icon: IconComponent;
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
        label: 'Techniques',
        href: '/techniques',
        icon: GraduationCap,
        description: 'Learn the conceptual phases — cross and intuitive F2L.'
      },
      {
        label: 'Algorithms',
        href: '/algorithms',
        icon: Blocks,
        description: 'Browse, curate, and drill your algorithm sets.'
      },
      {
        label: 'Solver',
        href: '/solver',
        icon: WandSparkles,
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
        icon: ChartColumn,
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

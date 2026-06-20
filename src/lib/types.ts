/**
 * The type of a lucide-svelte icon component (e.g. `LayoutDashboard`).
 *
 * lucide-svelte ships its icons as components extending its base `Icon` class,
 * so we type icon props as `typeof Icon`. This avoids Svelte's deprecated
 * `ComponentType`; the modern `Component` type does not match lucide's icons.
 */
export type IconComponent = typeof import('lucide-svelte').Icon;

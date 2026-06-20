import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names while resolving conflicting Tailwind utilities
 * (the last conflicting utility wins). Lets components ship sensible default
 * classes that callers can still override via a `class` prop.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

import { browser } from '$app/environment';

/**
 * Local-first data portability. Cubedrill keeps everything (learning status,
 * authored algorithms, stats, solves, goals, theme) in `cubedrill-*`
 * localStorage keys; until account sync lands, export/import is how you move it
 * between devices or back it up.
 */
const PREFIX = 'cubedrill-';

export interface ExportBundle {
  app: 'cubedrill';
  version: 1;
  exportedAt: string;
  data: Record<string, unknown>;
}

/** Every cubedrill localStorage key, parsed into a single bundle. */
export function exportData(): ExportBundle {
  const data: Record<string, unknown> = {};
  if (browser) {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith(PREFIX)) continue;
      const raw = localStorage.getItem(key);
      if (raw == null) continue;
      try {
        data[key] = JSON.parse(raw);
      } catch {
        data[key] = raw; // theme is a bare string, not JSON
      }
    }
  }
  return { app: 'cubedrill', version: 1, exportedAt: new Date().toISOString(), data };
}

/** Trigger a download of the current data as a JSON file. */
export function downloadExport(): void {
  if (!browser) return;
  const blob = new Blob([JSON.stringify(exportData(), null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cubedrill-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Replace all cubedrill data with an imported bundle, then reload so every
 * store re-reads from storage. Throws on a malformed bundle.
 */
export function importData(json: string): void {
  if (!browser) return;
  const parsed = JSON.parse(json) as Partial<ExportBundle>;
  if (parsed?.app !== 'cubedrill' || !parsed.data || typeof parsed.data !== 'object') {
    throw new Error('Not a Cubedrill backup file.');
  }
  clearData();
  for (const [key, value] of Object.entries(parsed.data)) {
    if (!key.startsWith(PREFIX)) continue;
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  }
  location.reload();
}

/** Remove every cubedrill key from localStorage. */
export function clearData(): void {
  if (!browser) return;
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(PREFIX)) keys.push(key);
  }
  for (const key of keys) localStorage.removeItem(key);
}

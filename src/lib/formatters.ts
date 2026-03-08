/**
 * Human-readable number and time formatters for display.
 */

const SUFFIX = ['', 'K', 'M', 'B', 'T', 'Q', 'q', 's'] as const;
const SCALE = [1, 1e3, 1e6, 1e9, 1e12, 1e15, 1e18, 1e21];

export function formatNumber(n: number, decimals = 2): string {
  if (!Number.isFinite(n)) return '—';
  if (n === 0) return '0';
  let i = 0;
  let x = Math.abs(n);
  while (x >= 1000 && i < SCALE.length - 1) {
    x /= 1000;
    i++;
  }
  const sign = n < 0 ? '-' : '';
  return sign + x.toFixed(decimals).replace(/\.?0+$/, '') + SUFFIX[i];
}

/** Format whole numbers (e.g. wave) with commas, no K/M/B abbreviation. */
export function formatInteger(n: number): string {
  if (!Number.isFinite(n)) return '—';
  return Math.round(n).toLocaleString();
}

export function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const parts: string[] = [];
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  parts.push(`${s}s`);
  return parts.join(' ');
}

export function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString(undefined, { dateStyle: 'medium' });
  } catch {
    return iso;
  }
}

/** Date and time for battle date (e.g. "Mar 08, 2026 16:53"). */
export function formatDateTime(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleString(undefined, {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch {
    return iso;
  }
}
